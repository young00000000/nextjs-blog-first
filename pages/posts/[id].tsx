import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'
import { getAllPostIds, getPostData, getSortedPostsData } from '../../lib/posts'
import homeStyles from '../../styles/Home.module.css'


export default function Post({
    postData
} : {
    postData: {
        title: string
        date: string
        contentHtml: string

    }
}) {
    return (
        <div>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={homeStyles.headingXl}>{postData.title}</h1>
                <div className={homeStyles.lightText}>
                    {postData.date}
                </div>
                <div dangerouslySetInnerHTML = {{__html: postData.contentHtml}} />
            </article>
        </div>
    ) 
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostIds();
    // [{params: {id: `pre-rendering`}. {params}}]
    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps =async ({params}) => {
    const postData = await getPostData(params.id as string)
    return {
        props: {
            postData
        }
    }

}