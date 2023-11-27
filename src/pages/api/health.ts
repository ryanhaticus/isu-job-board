import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (
  _: NextApiRequest,
  res: NextApiResponse<{
    success: boolean;
  }>,
) => {
  res.status(200).json({
    success: true,
  });
};

export default handler;
