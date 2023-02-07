
export const getEtherObject = () => (window['ethereum']);

export const checkWalletIsConnected = () => {
    const ethereum = getEtherObject();
    if(!ethereum){
        console.log("Make sure you have metamask!");
        return false;
    }
    console.log("We have ethereum object:", ethereum);
    return true;
};
