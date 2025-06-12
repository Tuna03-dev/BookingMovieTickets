
import type { RouteObject } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'

const routes: RouteObject[] = [

  {
    path: '/admin',
    element: (
        <AdminLayout/>
    ),
    children: [

    ]
  }
]

export default routes
