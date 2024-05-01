import React from 'react';
import styles from '../styles/Components/Footer.module.css'
import Link from 'next/link'
import Image from 'next/image'
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
            <ul className={styles["social-media-list"]}>
              <li className={styles["social-media-element"]}>
                <Link href="https://facebook.com">
                  <Image alt="facebook icon" src="/facebook.png" width="50" height="50"/>
                </Link>
              </li>
              <li className={styles["social-media-element"]}>
                <Link href="https://www.pinterest.co.uk/megamushroomsuk/">
                  <Image alt="pinterest icon" src="/pinterest.png" width="50" height="50"/>
                </Link>
              </li>
              <li className={styles["social-media-element"]}>
                <Link href="https://twitter.com/megamushroomsuk">
                  <Image alt="twitter / x icon"src="/x.png" width="50" height="50"/>
                </Link>
              </li>
              <li className={styles["social-media-element"]}>
                <Link href="https://www.instagram.com/megamushroomsuk/">
                  <Image alt="instagram" src="/insta.png" width="50" height="50"/>
                </Link>
              </li>
            </ul>
          </div>
        </footer>
    )
}