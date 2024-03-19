// pages/index.js
"use client"
import React, { Suspense, useEffect, useState } from 'react';
import {Card } from 'antd';
import {useRouter, useSearchParams} from 'next/navigation'
import ReactMarkdown from 'react-markdown'

interface Post {
    Title: string;
    Desc: string;
    Content: string;
    // 其他属性...
  }
const PostDetail = () => {
  const [post, setPost] = useState<Post|null>(null);
  const params = useSearchParams()
  const postId = params.get('id')
  useEffect(() => {
    fetch("https://mipa.moe:9999/api/threads/detail",{
        method: 'GET',
        headers: {
            'id': postId?.toString() as string,
        },
    })
      .then(response => response.json())
      .then(data => setPost(data.post));
  }, []);
  console.log(post)
  return (
    <div style={{height: '70vh',display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center',}}>
    <Card  style={{width:"80vw"}}>
      <h1>帖子详情</h1>
      {post ? (
        <div>
          <h2>{post.Title}</h2>
          <ReactMarkdown>{post.Content}</ReactMarkdown>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      </Card>
    </div>
  );
};

export default PostDetail;
