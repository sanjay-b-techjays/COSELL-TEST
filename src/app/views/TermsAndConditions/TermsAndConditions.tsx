import React from 'react';
import styles from './TermsAndConditions.module.css';
import dottedBg from '../../assets/dotted_bg.svg';

const TermsAndConditions = () => (
  <>
    <div className={styles.termsBannerWrap}>
      <div className={styles.bannerWrap}>
        <div className={styles.dotted1}>
          <img src={dottedBg} alt="dotted" />
        </div>
        <div className={styles.dotted2}>
          <img src={dottedBg} alt="dotted" />
        </div>
        <h1>Terms and Conditions</h1>
        <div className={styles.header}>1.Basis of the sale</div>
        <div className={styles.content}>
          1.1 The Seller shall sell and the Buyer shall purchase the Goods in
          accordance with any written quotation of the Seller which is accepted
          by the Buyer, or any written order of the Buyer which is accepted by
          the Seller, subject in either case to these Conditions which shall
          govern the Contract to the exclusion of any other terms and conditions
          subject to which any such quotation is accepted or purported to be
          accepted, or any such order is made or purported to be made, by the
          Buyer.
        </div>
        <div className={styles.content}>
          1.2 No variation to these Conditions shall be binding unless agreed in
          Writing between the authorised representatives of the Buyer and the
          Seller.
        </div>
        <div className={styles.content}>
          1.3 The Seller’s employees or agents are not authorised to make any
          representations concerning the Goods unless confirmed by the Seller in
          Writing. In entering into the Contract, the Buyer acknowledges that it
          does not rely on, and waives any claim for breach of, any such
          representations that are not so confirmed.
        </div>
        <div className={styles.content}>
          1.4 Any advice or recommendation given by the Seller or its employees
          or agents to the Buyer or its employees or agents as to the storage,
          application or use of the Goods which is not confirmed in Writing by
          the Seller is followed or acted upon entirely at the Buyer’s own risk,
          and accordingly the Seller shall not be liable for any such advice or
          recommendation which is not so confirmed.
        </div>
        <div className={styles.content}>
          1.5 Any typographical, clerical or other error or omission in any
          sales literature, quotation, price list, acceptance of offer, invoice
          or other document or information issued by the Seller shall be subject
          to correction without any liability on the part of the Seller
        </div>
        <div className={styles.header}> 2. Delivery </div>
        <div className={styles.content}>
          2.1 Delivery of the Goods shall be made by the Buyer collecting the
          Goods at the Seller’s premises at any time after the Seller has
          notified the Buyer that the Goods are ready for collection or, if some
          other place for delivery is agreed by the Seller, by the Seller
          delivering the Goods to that place.
        </div>
        <div className={styles.content}>
          2.2 Any dates quoted for delivery of the Goods are approximate only
          and the Seller shall not be liable for any delay in delivery of the
          Goods howsoever caused. Time for delivery shall not be of the essence
          unless previously agreed by the Seller in writing. The Goods may be
          delivered by the Seller in advance of the quoted delivery date upon
          giving reasonable notice to the Buyer. The Seller shall be entitled to
          make part delivery of the Goods at any time.
        </div>

        <div className={styles.header}> 3. Risk and property</div>
        <div className={styles.content}>
          3.1 Risk of damage to or loss of the Goods shall pass to the Buyer:
        </div>
        <div className={styles.content}>
          3.2 in the case of Goods to be delivered at the Seller’s premises, at
          the time when the Seller notifies the Buyer that the Goods are
          available for collection: or
        </div>
        <div className={styles.content}>
          3.3 in the case of Goods to be delivered otherwise than at the
          Seller’s premises, at the time of delivery or, if the Buyer wrongfully
          fails to take delivery of the Goods, the time when the Seller has
          tendered delivered of the Goods
        </div>
        <div className={styles.content}>
          3.4 Notwithstanding delivery and the passing of risk in the Goods, or
          any other provision of these Conditions, the property in the Goods
          shall not pass to the Buyer until the Seller has received in cash or
          cleared funds payment in full of the price of the Goods and payment in
          full of all sums due from the Buyer to the Seller whether under the
          Contract or by virtue of any other liability of the Buyer to the
          Seller.
        </div>
      </div>
    </div>
  </>
);

export default TermsAndConditions;
