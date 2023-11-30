import React from 'react';

const StudentInfo = () => {
  return (
    <div className='space-y-10 max-w-4xl'>
      <div>
        <h2 className='mt-4 text-lg font-semibold leading-6 text-gray-900'>Course Details</h2>
        <p className='mt-2 text-sm text-gray-700'><strong>Course Name:</strong> SE/ComS319 Construction of User Interfaces, Fall 2023</p>
        <p className='mt-1 text-sm text-gray-700'><strong>Date:</strong> Nov 30, 2023</p>
      </div>

      <div>
        <h3 className='text-lg font-semibold leading-6 text-gray-900'>Professor Information</h3>
        <p className='mt-2 text-sm text-gray-700'>Dr. Abraham N. Aldaco Gastelum</p>
        <p className='mt-1 text-sm text-gray-700'>Email: aaldaco@iastate.edu</p>
      </div>

      <div>
        <h3 className='text-lg font-semibold leading-6 text-gray-900'>Student Information</h3>
        <ul className='mt-2 space-y-2'>
          <li className='text-sm text-gray-700'>
            <p><strong>Name:</strong> Ryan Huellen</p>
            <p><strong>Email:</strong> rhuellen@iastate.edu</p>
            <img
                className='mt-4 h-40 w-40 rounded-full bg-gray-50'
                src='/ryan.jpeg'
                alt='Ryan'
            />
          </li>
          <li className='text-sm text-gray-700'>
            <p><strong>Name:</strong> Jayden Luse</p>
            <p><strong>Email:</strong> jcluse@iastate.edu</p>
            <img
                className='mt-4 h-40 w-40 rounded-full bg-gray-50'
                src='/jayden.jpeg'
                alt='Jayden'
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StudentInfo;