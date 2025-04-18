/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect } from "react";
import { IndexNavbar } from "../components/Navbars/IndexNavbar";
import { Footer } from "../components/Footers/Footer";
import { useRouter } from "next/router";

export const Index = () => {

    const router = useRouter();

    useEffect(() => {
        router.push("/admin/dashboard");
    })

    return (
        <>
            <IndexNavbar />
            <Footer />
        </>
    );
}

export default Index;