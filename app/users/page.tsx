import React from 'react'
import EmptyState from '../components/EmptyState';

type Props = {}

const Users = (props: Props) => {
  return (
    <div className='hidden lg:block lg:pl-80 h-full'>
        <EmptyState/>
    </div>
  )
}

export default Users;