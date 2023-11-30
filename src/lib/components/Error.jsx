import { XCircleIcon } from '@heroicons/react/20/solid';

export const Error = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className='mb-4 rounded-md bg-red-50 p-4'>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />
        </div>
        <div className='ml-3'>
          <h3 className='text-sm font-medium text-red-800'>
            There was an error
          </h3>
          <div className='mt-2 text-sm text-red-700'>
            <ul role='list' className='list-disc space-y-1 pl-5'>
              <li>{message}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
