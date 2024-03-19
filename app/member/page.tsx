"use client"
import { Card, Form, Button, Input, Row, Col, message, Modal } from "antd"
import { email_verify, get_user_info, loggin, regging, reset, resendm, search, admin } from "../api/fetchapi"
import { use, useEffect, useRef, useState } from "react";
import UserControllers from "../usercontroller";
import { setServers } from "dns";
import { Content } from "antd/es/layout/layout";
import { title } from "process";



const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};
type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

const Member: React.FC = () => {
    const [modal, contextHolder] = Modal.useModal()
    const [username, setUsername] = useState<string>('');
    const [reg_time, setRegTime] = useState<string>('');
    const [rp, setRp] = useState<string>('');
    var [isV, setisV] = useState(false)
    var [isloggedin, setisloggedin] = useState(false)
    var [isregging, setisregging] = useState(false)
    var [isAdmin, setisAdmin] = useState(false)
    const [isreseting, setisreseting] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searched, setsearched] = useState(false)
    const [search_username, setsearch_username] = useState('')
    const [search_isadmin, setsearch_isadmin] = useState(false)
    const [search_ban, setsearch_ban] = useState(false)
    const [search_rp, setsearch_rp] = useState('')
    const [op, setop] = useState('')
    const [loaded,setloaded] = useState(false)
    useEffect(() => {
        const token = localStorage.getItem('token')
        setUsername(localStorage.getItem('username') || '')
        setRegTime(localStorage.getItem('reg_time') || '')
        setRp(localStorage.getItem('rp') || '')
        if (localStorage.getItem('isverify') == 'false' || localStorage.getItem('isverify') == null) {
            console.log("NO V!")
            isV = false
            setisV(false)
        }
        else {
            isV = true
            setisV(true)
        }
        if (token) {
            get_user_info().then((res) => {
                if (!res) {
                    setisloggedin(false)
                    localStorage.clear()
                    message.error("登录已过期，请重新登录")
                }
                setloaded(true)
            })
            if (localStorage.getItem('isverify') == 'false') {
                setisV(false)
                setloaded(true)
            }
        }
        if (localStorage.getItem('isadmin') == 'true') {
            setisAdmin(true)
        }
        if (token) {
            setisloggedin(!!token)
        }
    }, [])
    const confirm_user = {
        title: '您确定吗？',
        Content: "您确定您的操作吗？",
    }
    const loggedout = () => {
        localStorage.clear()
        setisloggedin(false)
        message.success("已退出登录")
    }
    const onFinish = (values: any) => {
        console.log('Success:', values);
        loggin(values).then((res) => {
            if (res) {
                if (localStorage.getItem('isverify') != 'true') {
                    console.log("NO")
                    setisV(false)
                }
                else {
                    setisV(true)
                }
                setisloggedin(true)
                window.location.reload()
            }
            else {
                setisloggedin(false)
            }
        })
    };
    const resend = () => {
        resendm({ username: localStorage.getItem('username') })
    }
    const onFinish_reg = (values: any) => {
        console.log('Success:', values);
        regging(values).then((res) => {
            if (res) {
                setisloggedin(true)
                setisregging(false)
                isregging = false
            }
            else {
                setisloggedin(false)
            }
        })
    }
    const onFinish_email = (values: any) => {
        console.log('Success:', values);
        email_verify(values).then((res) => {
            if (res) {
                isV = true
                setisV(true)
            }
            else {
                isV = false
                setisV(false)
            }
        })
    }
    const onFinish_search = (values: any) => {
        search(values).then((res) => {
            console.log(res)
            if (res.code == 312) {
                setsearched(true)
                setsearch_ban(res.ban)
                setsearch_isadmin(res.isadmin)
                setsearch_rp(res.rp)
                setsearch_username(res.username)
            }
            else {
                message.error("用户不存在")
                setsearched(false)
            }
        })
    }
    const onFinish_reset = (values: any) => {
        reset(values)
        backLogin()
    }
    const goReg = () => {
        setisregging(true)
    }
    const backLogin = () => {
        setisregging(false)
        setisreseting(false)
    }
    const openUser = () => {
        setIsModalOpen(true)
    }
    const goreset = () => {
        setisreseting(true)
    }
    const handleOK = () => {
        setIsModalOpen(false)
    }
    const {confirm} = Modal
    return (
        <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <h1>用户中心</h1>
            {loaded && (<p>loading...</p>)}
            {isAdmin && isloggedin ? (
                <Card style={{ width: 400 }}>
                    <h3 style={{ color: "red", textAlign: "center" }}>管理员工具</h3>
                    <Button onClick={openUser}>用户操作</Button>
                    <Modal
                        title="用户操作"
                        open={isModalOpen}
                        onOk={handleOK}
                        footer={
                            [
                                <Button key="ok" onClick={handleOK}>
                                    关闭
                                </Button>
                            ]
                        }
                    >
                        <h3>搜索用户</h3>
                        <Form
                            name="search"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish_search}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            labelAlign="left"  // Set labelAlign to "left"
                        >
                            <Form.Item
                                label="用户名"
                                name="username"
                                rules={[{ required: true, message: '请输入用户名' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    搜索
                                </Button>
                            </Form.Item>
                            {searched && (
                                <div>
                                    <h3>用户信息</h3>
                                    <Row justify="space-between" align="middle">
                                        <Col><p>用户名：</p></Col>
                                        <Col><p style={{ color: "blue" }}>{search_username}</p></Col>
                                    </Row>
                                    <Row justify="space-between" align="middle">
                                        <Col><p>是否被封禁</p></Col>
                                        <Col><p style={{ color: "blue" }}>{search_ban == false ? '否' : '是'}</p></Col>
                                    </Row>
                                    <Row justify="space-between" align="middle">
                                        <Col><p>是否为管理员</p></Col>
                                        <Col><p style={{ color: "blue" }}>{search_isadmin == false ? '否' : '是'}</p></Col>
                                    </Row>
                                    <Row justify="space-between" align="middle">
                                        <Col><p>RP</p></Col>
                                        <Col><p style={{ color: "blue" }}>{search_rp}</p></Col>
                                    </Row>
                                    <Row justify="space-between" align="middle">
                                        <Col><Button onClick={() => {
                                            confirm({
                                                title: '您确定吗？',
                                                content: '您确定要删除该用户吗？',
                                                okText: '确定',
                                                cancelText: '取消',
                                                async onOk() {
                                                    await admin({ username: search_username, op: "Deluser" })
                                                    setsearched(false)
                                                    message.success("删除成功")
                                                },
                                            })
                                        }}>删除用户</Button></Col>
                                        <Col><Button onClick={()=>{
                                            confirm({
                                                title: '您确定吗？',
                                                content: '您确定要封禁该用户吗？',
                                                okText: '确定',
                                                cancelText: '取消',
                                                async onOk() {
                                                    await admin({ username: search_username, op: "Ban" })
                                                    setsearched(false)
                                                    message.success("封禁成功")
                                                },
                                            })
                                        }}>封禁</Button></Col>
                                        <Col><Button onClick={()=>{
                                            confirm({
                                                title: '您确定吗？',
                                                content: '您确定要解封该用户吗？',
                                                okText: '确定',
                                                cancelText: '取消',
                                                async onOk() {
                                                    await admin({ username: search_username, op: "DeBan" })
                                                    setsearched(false)
                                                    message.success("解封成功")
                                                },
                                            })
                                        }}>解封</Button></Col>
                                        <Col><Button onClick={()=>{
                                            confirm({
                                                title: '您确定吗？',
                                                content: '您确定要给予该用户管理员权限吗？',
                                                okText: '确定',
                                                cancelText: '取消',
                                                async onOk() {
                                                    await admin({ username: search_username, op: "Admin" })
                                                    setsearched(false)
                                                    message.success("操作成功")
                                                },
                                            })
                                        }}>给予管理员</Button></Col>
                                        <Col><Button onClick={()=>{
                                            confirm({
                                                title: '您确定吗？',
                                                content: '您确定要剥夺该用户管理员权限吗？',
                                                okText: '确定',
                                                cancelText: '取消',
                                                async onOk() {
                                                    await admin({ username: search_username, op: "DeAdmin" })
                                                    setsearched(false)
                                                    message.success("操作成功")
                                                },
                                            })
                                        }}>剥夺管理员</Button></Col>
                                    </Row>
                                    <Row justify="space-between" align="middle">
                                        <Col><Button>设置RP</Button></Col>
                                    </Row>
                                </div>
                            )}
                        </Form>
                    </Modal>
                </Card>
            ) : null}
            {isregging && (
                <Card style={{ width: 400 }}>
                    <Form
                        name="reg"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish_reg}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        labelAlign="left"  // Set labelAlign to "left"
                    >
                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[{ required: true, message: '请输入用户名' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="邮箱"
                            name="email"
                            rules={[{ required: true, message: '请输入邮箱' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="确认密码"
                            name="confirmpassword"
                            rules={[{ required: true, message: '请确认密码' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次密码不一致！'));
                                },
                            }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                            <Row gutter={7}>
                                <Col span={8}>
                                    <Button type="primary" htmlType="submit">
                                        注册
                                    </Button>
                                </Col>
                                <Col span={7}>
                                    <Button onClick={backLogin}>返回登录</Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </Card>
            )}
            {!isloggedin && !isregging && !isreseting ? (
                <Card style={{ width: 400 }}>
                    <Form
                        name="login"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        labelAlign="left"  // Set labelAlign to "left"
                    >
                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[{ required: true, message: '请输入用户名' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                            <Row gutter={10}>
                                <Col span={8}>
                                    <Button type="primary" htmlType="submit">
                                        登录
                                    </Button>
                                </Col>
                                <Col span={8}>
                                    <Button onClick={goReg}>注册</Button>
                                </Col>
                                <Col span={8}>
                                    <Button onClick={goreset}>重置密码</Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </Card>
            ) : !isregging && isV && !isreseting ? (
                <Card style={{ width: 400 }}>
                    <Row justify="space-between" align="middle">
                        <Col><p>用户名：</p></Col>
                        <Col><p style={{ color: "blue" }}>{username}</p></Col>
                    </Row>
                    <Row justify="space-between" align="middle">
                        <Col><p>注册时间：</p></Col>
                        <Col><p style={{ color: "blue" }}>{reg_time}</p></Col>
                    </Row>
                    <Row justify="space-between" align="middle">
                        <Col><p>RP：</p></Col>
                        <Col><p style={{ color: "blue" }}>{rp}</p></Col>
                    </Row>
                    <Row>
                        <Col span={7}><Button danger onClick={loggedout}>退出登录</Button></Col>
                        <Col span={7}><Button onClick={goreset}>重置密码</Button></Col>
                    </Row>
                </Card>
            ) : !isV && !isreseting ? (
                <Card style={{ width: 400, textAlign: "center" }}>
                    <h3>请先验证邮箱</h3>
                    <Form
                        name="mailverify"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish_email}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        labelAlign="left"  // Set labelAlign to "left"
                    >
                        <Form.Item
                            label="验证码"
                            name="email"
                            rules={[{ required: true, message: '请输入邮件验证码' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                            <Row gutter={10}>
                                <Col span={8}>
                                    <Button type="primary" htmlType="submit">
                                        确认
                                    </Button>
                                </Col>
                                <Col span={8}>
                                    <Button onClick={resend}>
                                        重发
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </Card>
            ) : isreseting ? (
                <Card style={{ width: 400, textAlign: "center" }}>
                    <h3>密码重置</h3>
                    <Form
                        name="reset"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish_reset}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        labelAlign="left"  // Set labelAlign to "left"
                    >
                        <Form.Item
                            label="邮箱"
                            name="email"
                            rules={[{ required: true, message: '请输入邮箱' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="确认密码"
                            name="confirmpassword"
                            rules={[{ required: true, message: '请确认密码' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次密码不一致！'));
                                },
                            }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                            <Row gutter={7}>
                                <Col span={10}>
                                    <Button type="primary" htmlType="submit">
                                        重置密码
                                    </Button>
                                </Col>
                                <Col span={10}>
                                    <Button onClick={backLogin}>返回</Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </Card>
            ) : null}
        </div>
    )
}
export default Member