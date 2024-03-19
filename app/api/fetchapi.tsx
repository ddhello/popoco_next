import { message } from 'antd'
export async function loggin(values: any) {
    const formData = new FormData()
    formData.append('username', values.username)
    formData.append('password', values.password)
    try {
        const api = await fetch('https://popoco.mipa.moe:9999/api/auth/login', {
            method: 'POST',
            headers: {
            },
            body: formData
        })
        const data = await api.json()
        console.log(data)
        if (data.code == 200) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('username', values.username)
            localStorage.setItem('reg_time', formatDateTime(data.reg_date))
            localStorage.setItem('rp', data.rp)
            localStorage.setItem('isverify',data.isverify)
            message.success('登录成功')
            return true
        }
        else if(data.Code==445){
            message.error('该用户已被封禁！')
            localStorage.clear()
            return false
        }
        else {
            message.error('用户名或密码错误')
            localStorage.clear()
            return false
        }
    }
    catch {
        console.log("error!!!")
        message.error('用户名或密码错误')
        localStorage.clear()
        return false
    }
}
export async function regging(values: any) {
    const formData = new FormData()
    formData.append('username', values.username)
    formData.append('password', values.password)
    formData.append('email', values.email)
    try {
        const api = await fetch('https://popoco.mipa.moe:9999/api/auth/register', {
            method: 'POST',
            headers: {
            },
            body: formData
        })
        const data = await api.json()
        console.log(data)
        if (data.code == 200) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('username', values.username)
            localStorage.setItem('reg_time', formatDateTime(data.reg_time))
            localStorage.setItem('rp', data.rp)
            message.success('注册成功')
            return true
        }
        else if (data.Code == 412) {
            message.error('用户名已存在')
            localStorage.clear()
            return false
        }
        else {
            message.error('注册失败')
            localStorage.clear()
            return false
        }
    }
    catch {
        console.log("error!!!")
        message.error('注册失败')
        localStorage.clear()
        return false
    }

}
export async function resendm(values: any) {
    const formData = new FormData()
    formData.append('username', values.username)
    const api = await fetch('https://popoco.mipa.moe:9999/api/auth/resend', {
        method: 'POST',
        headers: {
        },
        body: formData
    })
    message.success('已发送重发请求')
}
export async function get_user_info() {
    const token = localStorage.getItem('token')
    if (token) {
        const api = await fetch('https://popoco.mipa.moe:9999/api/auth/info', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
        })
        const data = await api.json()
        console.log(data)
        if (data.code == 200) {
            localStorage.setItem('username', data.user.username)
            localStorage.setItem('reg_time', formatDateTime(data.user.CreatedAt))
            localStorage.setItem('rp', data.user.Rp)
            localStorage.setItem('isadmin', data.user.Admin)
            localStorage.setItem('isverify',data.user.IsVerify)
            return true
        }
        else {
            localStorage.clear()
            return false
        }
    }
    else {
        localStorage.clear()
        return false
    }

}
export async function email_verify(values: any) {
    const formData = new FormData()
    formData.append('username', localStorage.getItem('username') as string)
    formData.append('Ecode', values.email)
    const api = await fetch('https://popoco.mipa.moe:9999/api/auth/email', {
        method: 'POST',
        headers: {
        },
        body: formData
    })
    const data = await api.json()
    console.log(data)
    if (data.Code == 102) {
        message.success('验证成功')
        localStorage.setItem('isverify','true')
        return true
    }
    else {
        message.error('验证码错误')
        return false
    }
}
export async function search(values: any) {
    const formData = new FormData()
    formData.append('username', values.username)
    const api = await fetch('https://popoco.mipa.moe:9999/api/admin/search', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token') as string
        },
        body: formData
    })
    const data = await api.json()
    if(data.code==200){
        message.error('用户不存在')
    }
    return data
}
export async function admin(values: any) {
    const formData = new FormData()
    formData.append('username', values.username) 
    const api = await fetch('https://popoco.mipa.moe:9999/api/admin', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token') as string,
            'op': values.op
        },
        body: formData
    })
    const data = await api.json()
    console.log(data)
    return data
}
export async function reset(values: any) {
    const formData = new FormData()
    formData.append('email', values.email)
    formData.append('password', values.password)
    const api = await fetch('https://popoco.mipa.moe:9999/api/auth/reset', {
        method: 'POST',
        headers: {
        },
        body: formData
    })
    message.success('如果邮箱存在，那么已发送重置密码邮件')
}
function formatDateTime(dateTimeString: string): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    const dateTime = new Date(dateTimeString);
    const formatter = new Intl.DateTimeFormat('zh-CN', options);
    return formatter.format(dateTime).replace(/\//g, '-');
}