import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA;

  if (commitSha) {
    res.status(200).json({ version: commitSha });
  } else {
    res.status(500).json({ error: 'Versão não encontrada' });
  }
}