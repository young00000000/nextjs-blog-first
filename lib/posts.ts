import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import exp from 'constants';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts'); 
//path.join()은 인자로 받은 경로들을 하나로 합쳐서 문자열 형태로 path를 리턴.ex) path.join('/apple','banana','orange/peach') 라면  '/apple/banana/orange/peach'를 리턴한다.
//process.cwd() 는 현재 작업 디렉토리를 뜻한다.
export function getSortedPostsData() {
    const fileNames = fs.readdirSync(postsDirectory); //postsDirectory 즉 현재경로 + posts 를 읽어온다.

    const allPostsData = fileNames.map(fileName => {
        const id = fileName.replace(/\.md$/, ""); // 바꾸고 싶은 문자열을 // 사이에 넣는다. , 오른쪽에는 무엇으로 바꿀지 씀. 여기서는 저 .md를 없애주고 싶기때문에 빈 문자열을 넣었다.

        const fullPath = path.join(postsDirectory, fileName); // postsDriectory/fileName
        const filecontents = fs.readFileSync(fullPath, 'utf-8') //fs.readFileSync(path, options) path에는 파일의 상대경로, 두파일이 같은 폴더에 있는경우 파일 이름을 따옴표로 묶는다. option: 인코딩 및 플래그를 포함하는 선택적 매개변수. 인코딩에는 데이터 사양이 포함,기본값은 null.플레그에는 차일의 작업표시포함, 기본값은 r.

        const matterResult = matter(filecontents); //md 파일

        return {
            id,
            ...matterResult.data as {date: string; title: string}
        }
    })

    return allPostsData.sort((a,b) => {
        if(a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory); //파일네임들이 배열로 들어가게 되겠죠
    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '') // md부분을 지워준다.
            }
        }
    })
}

export async function getPostData(id: string) {
    const fullPath= path.join(postsDirectory, `${id}.md`)
    const fileContents =fs.readFileSync(fullPath,'utf-8')

    const matterResult = matter(fileContents);

    const processContent = await remark().use(remarkHtml).process(matterResult.content);
    const contentHtml = processContent.toString();

    return {
        id,
        contentHtml,
        ...(matterResult.data as {date: string; title: string})
    }
}