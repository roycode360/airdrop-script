const filterAirdropHolders = (holdersArr) => {
  return holdersArr.filter(
    (holder) =>
      holder.account !==
        "GBLCU7XJBBVL64Z54V76JNPZDJC6LH5MEPC3YQEVBTZVEZ5WXP4NSOLS" &&
      holder.account !==
        "GB7LCWO6XBPU2JVLZNC6C6ZSHQK4WE5WVXWDRYCHW7SFDKB3UC5LNAIR" &&
      holder.account !==
        "GB2OMKTDS4IUUCSWE37SOCMWWZINKLV6ERJEKWZ5E5QBBBPH5AAAZSGF" &&
      holder.account !==
        "GBWQLI7DDS5SM27ATPWFEKQEMASKYXJCHQ43VURQGXMDQDPNQEY27SHR" &&
      holder.account !==
        "GCARYG2JJRDYMS6IRTJ7MIL5WYJYW7PTXMFIW4IFVMN7V5DGBCT23FCF" &&
      holder.account !==
        "GCUTMPQSTU5ETUKICSPNW3GCDQIXXCJPLKMW63N4SIE4KZ3XGLXVFPAY"
  );
};

module.exports = {
  filterAirdropHolders,
};
