import { graphql } from '@octokit/graphql';
import type { RawRepoMeta } from './github';

export interface RepoRef {
  owner: string;
  repo: string;
}

interface GraphQLBatchItem {
  id: string;
  meta: RawRepoMeta | null;
  commits30d: number;
}

const REPO_FIELDS = `
  nameWithOwner
  name
  description
  url
  homepageUrl
  stargazerCount
  forkCount
  isArchived
  pushedAt
  primaryLanguage { name }
  repositoryTopics(first: 20) { nodes { topic { name } } }
  owner { login avatarUrl resourcePath }
`;

function getToken() {
  return process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
}

function buildBatchQuery(
  batch: RepoRef[],
  aliasPrefix: string,
  since30d: string
): string {
  const aliases = batch
    .map((r, i) => {
      const safeOwner = JSON.stringify(r.owner);
      const safeRepo = JSON.stringify(r.repo);
      return `
  ${aliasPrefix}${i}: repository(owner: ${safeOwner}, name: ${safeRepo}) {
    ${REPO_FIELDS}
    defaultBranchRef {
      target {
        ... on Commit {
          hist: history(since: ${JSON.stringify(since30d)}) { totalCount }
        }
      }
    }
  }`;
    })
    .join('\n');

  return `query {\n${aliases}\n}`;
}

interface GraphQLRepoNode {
  nameWithOwner: string;
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  forkCount: number;
  isArchived: boolean;
  pushedAt: string;
  primaryLanguage: { name: string } | null;
  repositoryTopics: { nodes: { topic: { name: string } }[] };
  owner: { login: string; avatarUrl: string; resourcePath: string };
  defaultBranchRef: {
    target: { hist?: { totalCount: number } } | null;
  } | null;
}

function mapToMeta(
  node: GraphQLRepoNode | null,
  ref: RepoRef
): { meta: RawRepoMeta | null; commits30d: number } {
  if (!node) return { meta: null, commits30d: 0 };
  const meta: RawRepoMeta = {
    id: 0,
    name: node.name,
    full_name: node.nameWithOwner,
    description: node.description,
    html_url: node.url,
    homepage: node.homepageUrl,
    stargazers_count: node.stargazerCount,
    forks_count: node.forkCount,
    topics: node.repositoryTopics.nodes.map((n) => n.topic.name),
    language: node.primaryLanguage?.name ?? null,
    owner: {
      login: node.owner.login,
      avatar_url: node.owner.avatarUrl,
      html_url: `https://github.com${node.owner.resourcePath}`,
    },
    pushed_at: node.pushedAt,
    archived: node.isArchived,
  };
  const commits30d = node.defaultBranchRef?.target?.hist?.totalCount ?? 0;
  return { meta, commits30d };
}

async function queryBatch(
  client: ReturnType<typeof graphql.defaults>,
  batch: RepoRef[],
  since30d: string
): Promise<Record<string, GraphQLRepoNode | null> | null> {
  const query = buildBatchQuery(batch, 'r', since30d);
  try {
    return (await client(query)) as Record<string, GraphQLRepoNode | null>;
  } catch {
    return null;
  }
}

export async function fetchReposBatch(
  refs: RepoRef[],
  since30d: string,
  batchSize = 50
): Promise<Map<string, { meta: RawRepoMeta | null; commits30d: number }>> {
  const result = new Map<string, { meta: RawRepoMeta | null; commits30d: number }>();
  const token = getToken();
  const client = graphql.defaults({
    headers: token ? { authorization: `token ${token}` } : {},
  });

  for (let i = 0; i < refs.length; i += batchSize) {
    const batch = refs.slice(i, i + batchSize);
    process.stdout.write(
      `[graphql] 批次 ${i / batchSize + 1}/${Math.ceil(refs.length / batchSize)} (${batch.length} repos)... `
    );

    let response = await queryBatch(client, batch, since30d);

    // 整批失败（通常因为里面有 404 repo）：降级到逐个查询
    if (!response) {
      process.stdout.write(`(整批失败，逐个重试) `);
      response = {};
      for (let j = 0; j < batch.length; j++) {
        const single = await queryBatch(client, [batch[j]], since30d);
        response[`r${j}`] = single?.[`r0`] ?? null;
      }
    }

    let ok = 0;
    let miss = 0;
    for (let j = 0; j < batch.length; j++) {
      const ref = batch[j];
      const node = response[`r${j}`];
      const mapped = mapToMeta(node ?? null, ref);
      if (mapped.meta) ok += 1;
      else miss += 1;
      result.set(`${ref.owner}/${ref.repo}`.toLowerCase(), mapped);
    }
    console.log(`✓ ${ok} 成功 / ${miss} 404`);

    await new Promise((r) => setTimeout(r, 200));
  }

  return result;
}
