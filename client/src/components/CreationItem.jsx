import { Delete, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import Markdown from 'react-markdown';

const CreationItem = ({ item, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer'
    >
      <div className='flex justify-between items-start gap-4'>
        <div>
          <h2>{item.prompt}</h2>
          <p className='text-gray-500'>
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className='flex gap-2 items-center'>
          <button className='bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full'>
            {item.type}
          </button>

          <button
            className='text-red-500 hover:underline text-xs'
            onClick={(e) => {
              e.stopPropagation(); // Prevent expand toggle
              if (confirm("Are you sure you want to delete this creation?")) {
                onDelete(item.id);
              }
            }}
          >
            <Trash2 size={15}/>
          </button>
        </div>
      </div>

      {expanded && (
        <div className='mt-3'>
          {item.type === 'image' ? (
            <img src={item.content} alt="" className='w-full max-w-md' />
          ) : (
            <div className='h-full overflow-y-scroll text-sm text-slate-700'>
              <div className='reset-tw'>
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
