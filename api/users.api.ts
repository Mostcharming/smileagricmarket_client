import { User, UserResponse } from "@/types/user.types";

const mockUsers: User[] = [
  { id: "1", name: "Ava Carter", kycStatus: "Active", phoneNo: "(415) 555-0101", email: "ava.carter@example.com", nin: "12345678901", verificationImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop" },
  { id: "2", name: "Liam Bennett", kycStatus: "Pending", phoneNo: "(415) 555-0102", email: "liam.bennett@example.com", nin: "23456789012", verificationImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop" },
  { id: "3", name: "Sophia Turner", kycStatus: "Unverified", phoneNo: "(415) 555-0103", email: "sophia.turner@example.com", nin: "34567890123", verificationImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop" },
  { id: "4", name: "Mason Reed", kycStatus: "Active", phoneNo: "(415) 555-0104", email: "mason.reed@example.com", nin: "45678901234", verificationImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&h=200&auto=format&fit=crop" },
  { id: "5", name: "Ella Brooks", kycStatus: "Pending", phoneNo: "(415) 555-0105", email: "ella.brooks@example.com", nin: "56789012345", verificationImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&h=200&auto=format&fit=crop" },
  { id: "6", name: "Noah Hayes", kycStatus: "Unverified", phoneNo: "(415) 555-0106", email: "noah.hayes@example.com", nin: "67890123456", verificationImage: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&h=200&auto=format&fit=crop" },
  { id: "7", name: "Mia Foster", kycStatus: "Active", phoneNo: "(415) 555-0107", email: "mia.foster@example.com", nin: "78901234567", verificationImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop" },
  { id: "8", name: "Lucas Perry", kycStatus: "Pending", phoneNo: "(415) 555-0108", email: "lucas.perry@example.com", nin: "89012345678", verificationImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop" },
  { id: "9", name: "Charlotte Price", kycStatus: "Unverified", phoneNo: "(415) 555-0109", email: "charlotte.price@example.com", nin: "90123456789", verificationImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop" },
  { id: "10", name: "Elijah Ross", kycStatus: "Active", phoneNo: "(415) 555-0110", email: "elijah.ross@example.com", nin: "01234567890", verificationImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&auto=format&fit=crop" },
  { id: "11", name: "Amelia Gray", kycStatus: "Pending", phoneNo: "(415) 555-0111", email: "amelia.gray@example.com" },
  { id: "12", name: "James Cooper", kycStatus: "Unverified", phoneNo: "(415) 555-0112", email: "james.cooper@example.com" },
  { id: "13", name: "Harper Evans", kycStatus: "Active", phoneNo: "(415) 555-0113", email: "harper.evans@example.com" },
  { id: "14", name: "Benjamin Ward", kycStatus: "Pending", phoneNo: "(415) 555-0114", email: "benjamin.ward@example.com" },
  { id: "15", name: "Evelyn Powell", kycStatus: "Unverified", phoneNo: "(415) 555-0115", email: "evelyn.powell@example.com" },
  { id: "16", name: "Henry Simmons", kycStatus: "Active", phoneNo: "(415) 555-0116", email: "henry.simmons@example.com" },
  { id: "17", name: "Abigail Hughes", kycStatus: "Pending", phoneNo: "(415) 555-0117", email: "abigail.hughes@example.com" },
  { id: "18", name: "Jack Butler", kycStatus: "Unverified", phoneNo: "(415) 555-0118", email: "jack.butler@example.com" },
  { id: "19", name: "Emily Barnes", kycStatus: "Active", phoneNo: "(415) 555-0119", email: "emily.barnes@example.com" },
  { id: "20", name: "Alexander Murphy", kycStatus: "Pending", phoneNo: "(415) 555-0120", email: "alexander.murphy@example.com" },
  { id: "21", name: "Scarlett Bailey", kycStatus: "Unverified", phoneNo: "(415) 555-0121", email: "scarlett.bailey@example.com" },
  { id: "22", name: "William Jenkins", kycStatus: "Active", phoneNo: "(415) 555-0122", email: "william.jenkins@example.com" },
  { id: "23", name: "Grace Patterson", kycStatus: "Pending", phoneNo: "(415) 555-0123", email: "grace.patterson@example.com" },
  { id: "24", name: "Daniel Rivera", kycStatus: "Unverified", phoneNo: "(415) 555-0124", email: "daniel.rivera@example.com" },
  { id: "25", name: "Chloe Kelly", kycStatus: "Active", phoneNo: "(415) 555-0125", email: "chloe.kelly@example.com" },
  { id: "26", name: "Matthew Howard", kycStatus: "Pending", phoneNo: "(415) 555-0126", email: "matthew.howard@example.com" },
  { id: "27", name: "Lily Cox", kycStatus: "Unverified", phoneNo: "(415) 555-0127", email: "lily.cox@example.com" },
  { id: "28", name: "David Peterson", kycStatus: "Active", phoneNo: "(415) 555-0128", email: "david.peterson@example.com" },
  { id: "29", name: "Zoe Richardson", kycStatus: "Pending", phoneNo: "(415) 555-0129", email: "zoe.richardson@example.com" },
  { id: "30", name: "Samuel Wood", kycStatus: "Unverified", phoneNo: "(415) 555-0130", email: "samuel.wood@example.com" },
  { id: "31", name: "Layla Watson", kycStatus: "Active", phoneNo: "(415) 555-0131", email: "layla.watson@example.com" },
  { id: "32", name: "Jackson Brooks", kycStatus: "Pending", phoneNo: "(415) 555-0132", email: "jackson.brooks@example.com" },
  { id: "33", name: "Penelope Bell", kycStatus: "Unverified", phoneNo: "(415) 555-0133", email: "penelope.bell@example.com" },
  { id: "34", name: "Sebastian Russell", kycStatus: "Active", phoneNo: "(415) 555-0134", email: "sebastian.russell@example.com" },
  { id: "35", name: "Aria Griffin", kycStatus: "Pending", phoneNo: "(415) 555-0135", email: "aria.griffin@example.com" },
  { id: "36", name: "Logan Bryant", kycStatus: "Unverified", phoneNo: "(415) 555-0136", email: "logan.bryant@example.com" },
  { id: "37", name: "Victoria Hayes", kycStatus: "Active", phoneNo: "(415) 555-0137", email: "victoria.hayes@example.com" },
  { id: "38", name: "Carter Barnes", kycStatus: "Pending", phoneNo: "(415) 555-0138", email: "carter.barnes@example.com" },
  { id: "39", name: "Madison Foster", kycStatus: "Unverified", phoneNo: "(415) 555-0139", email: "madison.foster@example.com" },
  { id: "40", name: "Owen Perry", kycStatus: "Active", phoneNo: "(415) 555-0140", email: "owen.perry@example.com" },
  { id: "41", name: "Nora Bennett", kycStatus: "Pending", phoneNo: "(415) 555-0141", email: "nora.bennett@example.com" },
  { id: "42", name: "Wyatt Carter", kycStatus: "Unverified", phoneNo: "(415) 555-0142", email: "wyatt.carter@example.com" },
  { id: "43", name: "Hazel Reed", kycStatus: "Active", phoneNo: "(415) 555-0143", email: "hazel.reed@example.com" },
  { id: "44", name: "Julian Turner", kycStatus: "Pending", phoneNo: "(415) 555-0144", email: "julian.turner@example.com" },
  { id: "45", name: "Aurora Price", kycStatus: "Unverified", phoneNo: "(415) 555-0145", email: "aurora.price@example.com" },
  { id: "46", name: "Levi Ross", kycStatus: "Active", phoneNo: "(415) 555-0146", email: "levi.ross@example.com" },
  { id: "47", name: "Savannah Gray", kycStatus: "Pending", phoneNo: "(415) 555-0147", email: "savannah.gray@example.com" },
  { id: "48", name: "Dylan Cooper", kycStatus: "Unverified", phoneNo: "(415) 555-0148", email: "dylan.cooper@example.com" },
  { id: "49", name: "Stella Evans", kycStatus: "Active", phoneNo: "(415) 555-0149", email: "stella.evans@example.com" },
  { id: "50", name: "Gabriel Ward", kycStatus: "Pending", phoneNo: "(415) 555-0150", email: "gabriel.ward@example.com" },
  { id: "51", name: "Paisley Powell", kycStatus: "Unverified", phoneNo: "(415) 555-0151", email: "paisley.powell@example.com" },
  { id: "52", name: "Lincoln Simmons", kycStatus: "Active", phoneNo: "(415) 555-0152", email: "lincoln.simmons@example.com" },
  { id: "53", name: "Ellie Hughes", kycStatus: "Pending", phoneNo: "(415) 555-0153", email: "ellie.hughes@example.com" },
  { id: "54", name: "Luke Butler", kycStatus: "Unverified", phoneNo: "(415) 555-0154", email: "luke.butler@example.com" },
  { id: "55", name: "Avery Barnes", kycStatus: "Active", phoneNo: "(415) 555-0155", email: "avery.barnes@example.com" },
  { id: "56", name: "Mila Murphy", kycStatus: "Pending", phoneNo: "(415) 555-0156", email: "mila.murphy@example.com" },
  { id: "57", name: "Hudson Bailey", kycStatus: "Unverified", phoneNo: "(415) 555-0157", email: "hudson.bailey@example.com" },
  { id: "58", name: "Camila Jenkins", kycStatus: "Active", phoneNo: "(415) 555-0158", email: "camila.jenkins@example.com" },
  { id: "59", name: "Grayson Patterson", kycStatus: "Pending", phoneNo: "(415) 555-0159", email: "grayson.patterson@example.com" },
  { id: "60", name: "Penelope Rivera", kycStatus: "Unverified", phoneNo: "(415) 555-0160", email: "penelope.rivera@example.com" },
  { id: "61", name: "Leo Kelly", kycStatus: "Active", phoneNo: "(415) 555-0161", email: "leo.kelly@example.com" },
  { id: "62", name: "Aurora Howard", kycStatus: "Pending", phoneNo: "(415) 555-0162", email: "aurora.howard@example.com" },
  { id: "63", name: "Ezra Cox", kycStatus: "Unverified", phoneNo: "(415) 555-0163", email: "ezra.cox@example.com" },
  { id: "64", name: "Violet Peterson", kycStatus: "Active", phoneNo: "(415) 555-0164", email: "violet.peterson@example.com" },
  { id: "65", name: "Isaac Richardson", kycStatus: "Pending", phoneNo: "(415) 555-0165", email: "isaac.richardson@example.com" },
  { id: "66", name: "Aurora Wood", kycStatus: "Unverified", phoneNo: "(415) 555-0166", email: "aurora.wood@example.com" },
  { id: "67", name: "Eli Watson", kycStatus: "Active", phoneNo: "(415) 555-0167", email: "eli.watson@example.com" },
  { id: "68", name: "Scarlett Brooks", kycStatus: "Pending", phoneNo: "(415) 555-0168", email: "scarlett.brooks@example.com" },
  { id: "69", name: "Nathan Bell", kycStatus: "Unverified", phoneNo: "(415) 555-0169", email: "nathan.bell@example.com" },
  { id: "70", name: "Hannah Russell", kycStatus: "Active", phoneNo: "(415) 555-0170", email: "hannah.russell@example.com" },
  { id: "71", name: "Julian Griffin", kycStatus: "Pending", phoneNo: "(415) 555-0171", email: "julian.griffin@example.com" },
  { id: "72", name: "Aurora Bryant", kycStatus: "Unverified", phoneNo: "(415) 555-0172", email: "aurora.bryant@example.com" },
  { id: "73", name: "Leah Hayes", kycStatus: "Active", phoneNo: "(415) 555-0173", email: "leah.hayes@example.com" },
  { id: "74", name: "Eli Barnes", kycStatus: "Pending", phoneNo: "(415) 555-0174", email: "eli.barnes@example.com" },
  { id: "75", name: "Aubrey Foster", kycStatus: "Unverified", phoneNo: "(415) 555-0175", email: "aubrey.foster@example.com" },
  { id: "76", name: "Maya Perry", kycStatus: "Active", phoneNo: "(415) 555-0176", email: "maya.perry@example.com" },
  { id: "77", name: "Caleb Bennett", kycStatus: "Pending", phoneNo: "(415) 555-0177", email: "caleb.bennett@example.com" },
  { id: "78", name: "Aurora Reed", kycStatus: "Unverified", phoneNo: "(415) 555-0178", email: "aurora.reed@example.com" },
  { id: "79", name: "Landon Turner", kycStatus: "Active", phoneNo: "(415) 555-0179", email: "landon.turner@example.com" },
  { id: "80", name: "Ellie Price", kycStatus: "Pending", phoneNo: "(415) 555-0180", email: "ellie.price@example.com" },
  { id: "81", name: "Miles Ross", kycStatus: "Unverified", phoneNo: "(415) 555-0181", email: "miles.ross@example.com" },
  { id: "82", name: "Aurora Gray", kycStatus: "Active", phoneNo: "(415) 555-0182", email: "aurora.gray@example.com" },
  { id: "83", name: "Easton Cooper", kycStatus: "Pending", phoneNo: "(415) 555-0183", email: "easton.cooper@example.com" },
  { id: "84", name: "Hazel Evans", kycStatus: "Unverified", phoneNo: "(415) 555-0184", email: "hazel.evans@example.com" },
  { id: "85", name: "Wyatt Ward", kycStatus: "Active", phoneNo: "(415) 555-0185", email: "wyatt.ward@example.com" },
  { id: "86", name: "Aurora Powell", kycStatus: "Pending", phoneNo: "(415) 555-0186", email: "aurora.powell@example.com" },
  { id: "87", name: "Leo Simmons", kycStatus: "Unverified", phoneNo: "(415) 555-0187", email: "leo.simmons@example.com" },
  { id: "88", name: "Layla Hughes", kycStatus: "Active", phoneNo: "(415) 555-0188", email: "layla.hughes@example.com" },
  { id: "89", name: "Jack Butler", kycStatus: "Pending", phoneNo: "(415) 555-0189", email: "jack.butler@example.com" },
  { id: "90", name: "Avery Barnes", kycStatus: "Unverified", phoneNo: "(415) 555-0190", email: "avery.barnes@example.com" },
  { id: "91", name: "Mila Murphy", kycStatus: "Active", phoneNo: "(415) 555-0191", email: "mila.murphy@example.com" },
  { id: "92", name: "Hudson Bailey", kycStatus: "Pending", phoneNo: "(415) 555-0192", email: "hudson.bailey@example.com" },
  { id: "93", name: "Camila Jenkins", kycStatus: "Unverified", phoneNo: "(415) 555-0193", email: "camila.jenkins@example.com" },
  { id: "94", name: "Grayson Patterson", kycStatus: "Active", phoneNo: "(415) 555-0194", email: "grayson.patterson@example.com" },
  { id: "95", name: "Penelope Rivera", kycStatus: "Pending", phoneNo: "(415) 555-0195", email: "penelope.rivera@example.com" },
  { id: "96", name: "Leo Kelly", kycStatus: "Unverified", phoneNo: "(415) 555-0196", email: "leo.kelly@example.com" },
];

export const getUsers = async (page: number = 1, search: string = "", kycStatus?: string): Promise<UserResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  let filteredUsers = mockUsers;
  
  // Filter by KYC status if provided
  if (kycStatus) {
    filteredUsers = filteredUsers.filter(user => user.kycStatus === kycStatus);
  }
  
  // Filter by search term
  if (search) {
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) || 
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  const itemsPerPage = 10;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  
  return {
    users: filteredUsers.slice(start, end),
    totalUsers: filteredUsers.length
  };
};
