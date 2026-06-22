import React from 'react'

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 min-h-[300px]">
      <div className="text-sm font-medium text-black tracking-wider animate-pulse">
        LOADING
      </div>
      <div className="w-48 h-1 bg-muted rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-full bg-primary rounded-full w-1/2 animate-[loading_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  )
}

export default Loading