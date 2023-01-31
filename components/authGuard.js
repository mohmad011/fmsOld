import React, { useEffect } from "react";
import { Provider, useSession } from "next-auth/client";
import Router, { useRouter } from "next/router";
import Layout from "../layout";
import { useDispatch } from "react-redux";
import { getUser } from "../lib/slices/auth";
import Loader from "./loader";
import config from "config/config";
import axios from "axios";

const AuthGuard = ({ children }) => {
  const [session, loading] = useSession();
  const hasUser = !!session?.user;
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!loading && !hasUser) {
      Router.push("/auth/signin");
      delete axios.defaults.headers.common.Authorization;
    }

    // if(session?)
    return () => {
      dispatch(getUser(session?.user));
      axios.defaults.headers.common.Authorization = `Bearer ${session?.user?.new_token}`;
      axios.defaults.baseURL = config?.apiGateway?.URL;
    };
  }, [loading, hasUser, session, dispatch]);

  if ((loading || !hasUser) && router.pathname !== "/auth/signin") {
    return <Loader />;
  }

  return (
    <Provider
      options={{
        clientMaxAge: 0,
        keepAlive: 0,
      }}
      session={session}
    // refetchInterval={5}
    // Re-fetches session when window is focused
    // refetchOnWindowFocus={true}
    >
      {!loading && hasUser && router.pathname !== "/auth/signin" ? (
        <Layout>{children}</Layout>
      ) : (
        children
      )}
    </Provider>
  );
};
export default AuthGuard;
