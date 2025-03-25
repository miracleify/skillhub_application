import { createContext, useContext, useState } from 'react';

// Initial data
const initialTradespeople = [
  {
    id: 0,
    fname: 'Kola',
    lname: 'Adekunle',
    profession: 'Painter',
    verified: true,
    image: '/userProfile/kola.png',
    expertise: 'Wiring, repairs, lighting, electrical upgrades',
    location: 'Lagos, Nigeria',
    ratings: '★★★★★',
    biography:
      "Hi, I'm Kelly, a certified electrician with over 10 years of experience in residential and commercial electrical work. I take pride in delivering reliable, professional, and affordable electrical solutions. Whether it's a small repair or a major installation, you can count on me to get it done right the first time. My goal is to provide top-quality service while keeping your home or business powered and secure.",
    video: '/video.png',
    caption: 'Get to know Kelly via this short introductory video',
    serviceArea:  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.46310560885!2d3.1191404803109495!3d6.548369375048859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1742706871742!5m2!1sen!2sng",
    isOnline: true,
  },
  {
    id: 1,
    fname: 'Adewale',
    lname: 'OgunLeye',
    profession: 'Plumber',
    verified: true,
    image: '/userProfile/wale.png',
    expertise: 'Wiring, repairs, lighting, electrical upgrades',
    location: 'Lagos, Nigeria',
    ratings: '★★★★★',
    biography:
      "Hi, I'm Kelly, a certified electrician with over 10 years of experience in residential and commercial electrical work. I take pride in delivering reliable, professional, and affordable electrical solutions. Whether it's a small repair or a major installation, you can count on me to get it done right the first time. My goal is to provide top-quality service while keeping your home or business powered and secure.",
    video: '/video.png',
    caption: 'Get to know Kelly via this short introductory video',
    serviceArea:  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.46310560885!2d3.1191404803109495!3d6.548369375048859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1742706871742!5m2!1sen!2sng",
    isOnline: true,
  },
  {
    id: 2,
    fname: 'Zainab',
    lname: 'Suleiman',
    profession: 'Electrician',
    verified: true,
    image: '/userProfile/zainab.png',
    expertise: 'Wiring, repairs, lighting, electrical upgrades',
    location: 'Lagos, Nigeria',
    ratings: '★★★★★',
    biography:
      "Hi, I'm Kelly, a certified electrician with over 10 years of experience in residential and commercial electrical work. I take pride in delivering reliable, professional, and affordable electrical solutions. Whether it's a small repair or a major installation, you can count on me to get it done right the first time. My goal is to provide top-quality service while keeping your home or business powered and secure.",
    video: '/video.png',
    caption: 'Get to know Kelly via this short introductory video',
    serviceArea:  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.46310560885!2d3.1191404803109495!3d6.548369375048859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1742706871742!5m2!1sen!2sng",
    isOnline: false,
  },
  {
    id: 3,
    fname: 'Chinedu',
    lname: 'Okafor',
    profession: 'Carpenter',
    verified: true,
    image: '/userProfile/okafor.png',
    expertise: 'Wiring, repairs, lighting, electrical upgrades',
    location: 'Lagos, Nigeria',
    ratings: '★★★★★',
    biography:
      "Hi, I'm Kelly, a certified electrician with over 10 years of experience in residential and commercial electrical work. I take pride in delivering reliable, professional, and affordable electrical solutions. Whether it's a small repair or a major installation, you can count on me to get it done right the first time. My goal is to provide top-quality service while keeping your home or business powered and secure.",
    video: '/video.png',
    caption: 'Get to know Kelly via this short introductory video',

    serviceArea:  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.46310560885!2d3.1191404803109495!3d6.548369375048859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1742706871742!5m2!1sen!2sng",
 isOnline: true,
  },
];
"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.46310560885!2d3.1191404803109495!3d6.548369375048859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1742706871742!5m2!1sen!2sng" 

const TradesContext = createContext();

export const TradesProvider = ({ children }) => {
  const [tradespeople, setTradespeople] = useState(initialTradespeople);

  return (
    <TradesContext.Provider value={{ tradespeople, setTradespeople }}>
      {children}
    </TradesContext.Provider>
  );
};

export const useTrades = () => useContext(TradesContext);