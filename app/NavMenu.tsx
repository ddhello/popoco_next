"use client"
import {Menu,MenuProps} from 'antd';
import { useRouter,usePathname } from 'next/navigation';
interface ClientMenuProps extends MenuProps {
    onClientClick: (key: string) => void;
  }
  const items: MenuProps['items'] = [
    {
      label: <div><img title='Popoco Studio' style={{width:"50px", marginTop:"0px",marginBottom:"-15px"}} src="/popoco.jpg"></img><span style={{marginLeft:"5px",fontSize:"16px"}}>Popoco Studio</span></div>,
      key: 'logo',
    },
    {
      label: '首页',
      key: 'home',
    },
    {
      label: '关于',
      key: 'about',
    },
    {
      label: '用户中心',
      key: 'member',
    },
  ]; 

export function NavMenu(){
  const router = useRouter();
  var current_router = usePathname();
  if(current_router=='/')
  {
    current_router = "/home"
  }
  const menu_click: MenuProps['onClick'] = (e) => {
    console.log(e)
    if(e.key=='home'||e.key=='logo'){
      router.push('/')
      console.log('goto home')
    }
    else if(e.key=='about'){
      router.push('/about')
      console.log('goto about')
    }
    else if(e.key=='member'){
      router.push('/member')
      console.log('goto member')
    }
  }
  return(
    <Menu onClick={menu_click} selectedKeys={[current_router.slice(1)]} items={items} mode="horizontal" />
  )
}