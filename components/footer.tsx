import React from 'react';
import styles from '../styles/Components/Footer.module.css'
import Link from 'next/link'
export default function Footer(){
    return(
        <footer id="footer" className={styles.footer}>
          <div className={styles.wrapper}>
            <h2 className={styles["footer-heading"]}>Policy</h2>
            <ul className={styles["footer-nav"]}>

              <li className={styles["footer-link"]}><Link href="/cookies">Cookies</Link></li>
              <li className={styles["footer-link"]}><Link href="/delivery">Deliveries</Link></li>
              <li className={styles["footer-link"]}><Link href="/returns">Returns</Link></li>
              <li className={styles["footer-link"]}><Link href="/privacy">Privacy</Link></li>
            </ul>
          </div>
        </footer>
    )
}