'use client'
import { Layout } from 'antd';
import React from 'react'

const AdminFooter = () => {
    const { Footer } = Layout;
    return (
        <Footer style={{ textAlign: 'center' }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
    )
}

export default AdminFooter;