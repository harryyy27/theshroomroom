import React from 'react';
import styles from '../styles/Components/Footer.module.css'
import Link from 'next/link'
import Image from 'next/image'
export default function Footer(){
    return(
        <footer id="footer" className={styles.footer}>
            <div className={styles["footer-section"]}>
              <h2 className={styles["footer-heading"]}>Policy:</h2>
              <div className={styles["list-wrapper"]}>
              <ul className={styles["footer-nav"]}>

                <li className={styles["footer-link"]}><Link className={styles["policy-link"]} href="/cookies">Cookies</Link></li>
                <li className={styles["footer-link"]}><Link className={styles["policy-link"]}href="/delivery">Deliveries</Link></li>
                <li className={styles["footer-link"]}><Link className={styles["policy-link"]}href="/returns">Returns</Link></li>
                <li className={styles["footer-link"]}><Link className={styles["policy-link"]} href="/privacy">Privacy</Link></li>
              </ul>
              </div>
            </div>
            <div className={styles["footer-section"]}>
              <h2 className={styles["footer-heading"]}>Follow us:</h2>
              <div className={styles["list-wrapper"]}>
              <ul className={styles["footer-nav"]+" " + styles["social-media"]}>
                <li className={styles["social-media-element"]}>

                  <Link href="https://www.facebook.com/megamushroomsuk">
                    <Image className={styles["social-media-icon"]}alt="facebook icon" src="/facebook.png" width="50" height="50"/>
                  </Link>
                </li>
                <li className={styles["social-media-element"]}>
                  <Link href="https://www.pinterest.co.uk/megamushroomsuk/">
                    <Image className={styles["social-media-icon"]}alt="pinterest icon" src="/pinterest.png" width="50" height="50"/>
                  </Link>
                </li>
                <li className={styles["social-media-element"]}>
                  <Link href="https://twitter.com/megamushroomsuk">
                    <Image className={styles["social-media-icon"]}alt="twitter / x icon"src="/x.png" width="50" height="50"/>
                  </Link>
                </li>
                <li className={styles["social-media-element"]}>
                  <Link href="https://www.instagram.com/megamushroomsuk/">
                    <Image className={styles["social-media-icon"]}alt="instagram" src="/insta.png" width="50" height="50"/>
                  </Link>
                </li>
              </ul>
              </div>
            </div>
            
        </footer>
    )
}