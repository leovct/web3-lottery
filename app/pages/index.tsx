import type { NextPage } from "next"
import { SetStateAction, useState } from "react"
import Head from "next/head"
import styles from "../styles/Home.module.css"

import Header from "../sections/shared/Header"
import Play from "../sections/play/Play"
import Rules from "../sections/rules/Rules"
import Winners from "../sections/winners/Winners"
import Footer from "../sections/shared/Footer"

const Home: NextPage = () => {
  const [currentPage, setCurrentPage] = useState<string>("home")
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Avocado</title>
        <meta name="description" content="Fun guessing game using blockchain technology and oracles to ensure transparency and reliability" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Header currentPage={currentPage} handleClick={(page) => setCurrentPage(page)}></Header>
        { currentPage == "home" && <Play></Play>}
        { currentPage == "rules" && <Rules></Rules>}
        { currentPage == "winners" && <Winners></Winners>}
        <Footer></Footer>
      </main>
    </div>
  )
}

export default Home
