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
    serviceArea: 'https://youtu.be/rEEZD5hXgrQ',
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
    serviceArea: 'https://youtu.be/rEEZD5hXgrQ',
    isOnline: false,
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
    serviceArea: 'https://youtu.be/rEEZD5hXgrQ',
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
    serviceArea: 'https://youtu.be/rEEZD5hXgrQ',
    isOnline: true,
  },
];

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