'use client'
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, notification, Steps } from 'antd';
import { useHasMounted } from '@/utils/customHook';
import {  SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { sendRequest } from '@/utils/api';

const ModalReactive = (props: any) => {
    const { isModalOpen, setIsModalOpen,  email } = props;
    
    const [ current, setCurrent ] = useState(0);
    const hasMounted = useHasMounted();
    const [form] = Form.useForm();
    const [ userId, setUserId ] = useState("");

    useEffect(() => {
        console.log(`Modal is open: ${email}`)
        if(email){
            form.setFieldValue('email', email)
        }
    },[email])

    if (!hasMounted) return<></>;

    const onFinishStep0 = async(values: any) => {
        const { email } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/retry-active`,
            method: 'POST',
            body: { 
                email,
            },
        })
        if (res.data){
            setUserId(res?.data?._id)
            setCurrent(1)
        }else{
            notification.error({
                message: 'Register error',
                description: res?.message
            })
        }
    };

    const onFinishStep1 = async(values: any) => {
        const { code } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/check-code`,
            method: 'POST',
            body: { 
                code, _id: userId
            },
        })
        if (res.data){
            setCurrent(2)
        }else{
            notification.error({
                message: 'Register error',
                description: res?.message
            })
        }
    };

    return (
        <>
            <Modal 
                title="Kích Hoạt Tài Khoản" 
                open={isModalOpen} 
                onOk={() => setIsModalOpen(false)} 
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
                footer={null}
                
            >
                <Steps
                    current={current}
                    items={[
                    {
                        title: 'Login',
                        status: 'finish',
                        icon: <UserOutlined />,
                    },
                    {
                        title: 'Verification',
                        // status: 'finish',
                        icon: <SolutionOutlined />,
                    },
                    {
                        title: 'Done',
                        // status: 'wait',
                        icon: <SmileOutlined />,
                    },
                    ]}
                />
                {current === 0 && 
                <>
                    <div style={{ marginTop: "20px 0" }}>
                        <p>Tài khoản của bạn chưa được kích hoạt</p>
                    </div>
                    <Form
                    name="verify"
                    onFinish={onFinishStep0}
                    autoComplete="off"
                    layout='vertical'
                    form={form}
                    >
                        <Form.Item
                            label=""
                            name="email"
                        >
                            <Input disabled value={email} />
                        </Form.Item>

                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit">
                                ReSend
                            </Button>
                        </Form.Item>
                    </Form>
                </>
                }

                {current === 1 && 
                    <>
                    <div style={{ marginTop: "20px 0" }}>
                        <p>nhập mã kích hoạt</p>
                    </div>
                    <Form
                    name="verify"
                    onFinish={onFinishStep1}
                    autoComplete="off"
                    layout='vertical'
                    form={form}
                    >
                        <Form.Item
                            label="code"
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your code!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit">
                                Active
                            </Button>
                        </Form.Item>
                    </Form>
                </>
                }
                {current === 2 &&
                    <div style={{ marginTop: "20px 0" }}>
                        <p>Tài khoản của bạn đã được kích hoạt thành công vui lòng đăng nhập lại</p>
                    </div>
                }
            </Modal>
        </>
    );
}

export default ModalReactive;
