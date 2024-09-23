'use client'
import AdminFooter from '@/components/layout/admin.footer';
import AdminHeader from '@/components/layout/admin.header';
import AdminSideBar from '@/components/layout/admin.sidebar';
import { Layout, theme } from 'antd';
import React from 'react'

const AdminLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const { Content } = Layout;
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
    return (
        <Layout>
            <AdminSideBar />
            <Layout>
                <AdminHeader />
                <Content style={{ margin: '24px 16px 0' }}>
                    <div
                    style={{
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                    >
                    {children}
                    </div>
                </Content>
                <AdminFooter/>
            </Layout>
        </Layout>
    )
}

export default AdminLayout