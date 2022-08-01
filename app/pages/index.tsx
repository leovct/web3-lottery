import React from "react"
import { useState } from "react"
import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"

import Header from "../sections/shared/Header"
import Play from "../sections/play/Play"
import Rules from "../sections/rules/Rules"
import Winners from "../sections/winners/Winners"
import Dashboard from "../sections/dashboard/Dashboard"
import Footer from "../sections/shared/Footer"

import { LOTTERY_CONFIG } from "../constants/address"
import { useAccount, useContractRead } from "wagmi"


const Home: NextPage = () => {
  const { address, isConnected } = useAccount()
  
  const [currentPage, setCurrentPage] = useState<string>("home")
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  
  const { data: ownerData } = useContractRead({
    ...LOTTERY_CONFIG,
    functionName: "ownerAddress",
		watch: true,
  })

  React.useEffect(() => {
    if (isConnected && ownerData) {
      const newIsAdmin = address === ownerData.toString()
      if (isAdmin !== newIsAdmin) {
        setIsAdmin(newIsAdmin)
      }
    } else {
      setIsAdmin(false)
    }
  }, [address, isAdmin, isConnected, ownerData])
  
  return (
    <div className={styles.container}>
      <Head>
        <title>web3.lottery</title>
        <meta name="description" content="Fun guessing game using blockchain technology and oracles to ensure transparency and reliability" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Header currentPage={currentPage} handleClick={(page) => setCurrentPage(page)} isAdmin={isAdmin}></Header>
        { currentPage == "home" && <Play></Play>}
        { currentPage == "rules" && <Rules></Rules>}
        { currentPage == "winners" && <Winners></Winners>}
        { currentPage == "dashboard" && <Dashboard></Dashboard>}
        <Footer></Footer>
      </main>
    </div>
  )
}

export default Home
