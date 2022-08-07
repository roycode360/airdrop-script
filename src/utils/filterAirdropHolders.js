const filterAirdropHolders = (holdersArr) => {
  return holdersArr.filter(
    (holder) =>
      holder.account !==
        "GBFM3VVYLDROK4LXBYAJF6B5NJTOGDDO6LFQKHL2XPVB6A4INKYZQD62" &&
      holder.account !==
        "GDXAFTRWZXBCM7T6QGA2LE5XXV5G4LUU5L27XBFOSRWZRF6GXRRDWBRN" &&
      holder.balance !== 0
  );
};

module.exports = {
  filterAirdropHolders,
};
