import { useEffect } from 'react';
import withAuth from '../hocs/withAuth'

function Home() {
  useEffect(() => {
    document.title = "Trang chủ"
  }, []);
  return (
    <div className='text-center py-20'>
      <h1 className="text-4xl text-black">Đây là trang quản trị</h1>
    </div>
  )
}

const HomeWithAuth = withAuth(Home)

export default HomeWithAuth