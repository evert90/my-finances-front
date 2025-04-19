/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect } from "react";
import { useRouter } from "next/router";

export const Index = () => {

    const router = useRouter();

    useEffect(() => {
        router.push("/admin/dashboard");
    })

    return (
        <>
        </>
    );
}

export default Index;