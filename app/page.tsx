"use client"
import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import Link from 'next/link';

type Post = {
  ID: number;
  Title: string;
  Desc: string;
  Content: string;
  Author: string;
  // 其他属性...
};

const Threads: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("https://popoco.mipa.moe:9999/api/threads/get")
      .then(response => response.json())
      .then(data => {
        // 排序帖子数组，按照 ID 倒序排列
        const sortedPosts = data.posts.sort((a: { ID: number; }, b: { ID: number; }) => b.ID - a.ID);
        setPosts(sortedPosts);
      });
  }, []);

  return (
    <div style={{display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center',}}>
      <h1>博客帖子</h1>
      <ul>
        {posts.length === 0 && <p>Loading...</p>}
        {posts.map(post => (
          <Card key={post.ID} style={{ width: '80vw',marginBottom:"3vh" }}>
            <Link href={{pathname:'/threads',query:{"id":post.ID}}} style={{fontSize: "25px"}}>{post.Title}</Link>
            <p style={{fontSize: "16px"}}>{post.Desc.slice(0,200)}</p>
          </Card>
        ))}
      </ul>
    </div>
  );
};

export default Threads;
