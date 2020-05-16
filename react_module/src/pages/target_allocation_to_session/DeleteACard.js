import React from 'react'
import Sortable from 'react-sortablejs'
import style from './style.module.scss'

const DeleteACard = () => {
  return (
    <Sortable
      className={style.deleteButton}
      options={{
        group: {
          name: 'shared',
          put: true,
        },
      }}
    >
      <span>Delete</span>
    </Sortable>
  )
}

export default DeleteACard
