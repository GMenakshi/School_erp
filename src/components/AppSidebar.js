import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CIcon from '@coreui/icons-react'
import { cilLayers } from '@coreui/icons'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

// Import navigation items
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        {/* Full logo for expanded sidebar */}
        <div className="sidebar-brand-full d-flex align-items-center">
          <CIcon icon={cilLayers} height={30} className="me-2" />
          <span style={{ fontWeight: 600, fontSize: '1.25rem', letterSpacing: '1px' }}>
            NeXaric
          </span>
        </div>

        {/* Icon-only logo for collapsed sidebar */}
        <div className="sidebar-brand-narrow">
          <CIcon icon={cilLayers} height={30} />
        </div>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
