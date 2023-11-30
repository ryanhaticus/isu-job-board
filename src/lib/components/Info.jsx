import { InformationCircleIcon } from '@heroicons/react/20/solid';

export const Info = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className='mb-4 rounded-md bg-gray-50 p-4'>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <InformationCircleIcon
            className='h-5 w-5 text-gray-400'
            aria-hidden='true'
          />
        </div>
        <div className='ml-3'>
          <h3 className='text-sm font-medium text-gray-800'>Hey!</h3>
          <div className='mt-2 text-sm text-gray-700'>
            <ul role='list' className='list-disc space-y-1 pl-5'>
              <li>{message}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
