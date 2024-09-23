'use client'
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
                Nguyễn Bảo Thi ©{new Date().getFullYear()} Created by Nguyễn Bảo Thi
            </Footer>
        </>
    )
}

export default AdminFooter;