import React, { useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import { parseJwt } from '../utils/parseJwt';
import Cookies from 'js-cookie';

function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  requireAuth: boolean = true
): ComponentType<P> {
  const WithAuth: React.FC<P> = (props) => {
    const navigate = useNavigate();
    const notification = useNotification();
    const hasShownNotification = useRef(false); // Cờ kiểm tra trạng thái thông báo

    useEffect(() => {
      const checkAuth = () => {
        const token = Cookies.get('accessToken') as string;
        const isAuthenticated = !!token;
        const user = parseJwt(token);

        if ((requireAuth && !isAuthenticated) || (isAuthenticated && (user?.role !== 'ADMIN' && user?.role !== 'STAFF'))) {
          if (!hasShownNotification.current) {
            // Hiển thị thông báo và cập nhật trạng thái
            notification.warning('Bạn không có quyền truy cập vào trang này!');
            hasShownNotification.current = true;
          }
          navigate('/login');
        } else if (!requireAuth && isAuthenticated) {
          navigate('/');
        }
      };

      checkAuth();
    }, [navigate, notification]);

    return <WrappedComponent {...props} />;
  };

  WithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuth;
}

export default withAuth;