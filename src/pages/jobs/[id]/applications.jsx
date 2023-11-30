import { useRouter } from 'next/router';

const SpecificJobApplicants = () => {
  const router = useRouter();

  return router.query.id;
};

export default SpecificJobApplicants;
