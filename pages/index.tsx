import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";
import { abis } from "@/utils/abi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { erc20ABI, useAccount } from "wagmi";
import { formatGwei, parseGwei, formatUnits, parseUnits } from "viem";
import {
  fetchBalance,
  multicall,
  readContract,
  waitForTransaction,
  writeContract,
} from "wagmi/actions";
import toast from "react-hot-toast";
import Moralis from "moralis";
import { getData } from "@/libs/gas";
import { getInfo } from "@/libs/infoToken";
import { getPrice } from "@/libs/priceInfo";
import Button from "./Apy";

export default function Home() {
  const [tokenAddress] = useState<`0x${string}`>(
    "0x52cd6956F59fa78054388beF3bca467e241Be8A2" //orb
  );

  const [SC1] = useState<`0x${string}`>(
    "0xa945Bd76f49d2f33E9AAD626c5E708088F7482E1"
  );
  const [SC2] = useState<`0x${string}`>(
    "0x2e3C36606696d83EE01F76F4ca31123Ce59D883b"
  );
  const [SC3] = useState<`0x${string}`>(
    "0xadf7De5E41Cd7a5905E7D75E08dB6E3e9f7e6cDa"
  );

  const [tokenPrice, setTokenPrice] = useState("");
  const [holders, setholders] = useState("");
  const [mcap, setmcap] = useState("");
  const [chnge, setchnge] = useState("0");


  const [chainId] = useState(1);
  const [tvl, setTVL] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [inputAmount2, setInputAmount2] = useState("");

  const [totalReward, setTotalReward] = useState("");
  const [totalStaker, setTotalStaker] = useState("");
  const [yourStaked, setYourStaked] = useState("");
  const [yourReward, setYourReward] = useState("");
  const [yourStaked2, setYourStaked2] = useState("");
  const [yourReward2, setYourReward2] = useState("");
  const [yourStaked3, setYourStaked3] = useState("");
  const [yourReward3, setYourReward3] = useState("");
  const [myStaked, setmyStaked] = useState("");
  const [myReward, setmyReward] = useState("");

  const [balance, setBalance] = useState("");
  const [balance2, setBalance2] = useState("");
  const { address, isConnected } = useAccount();
  const [disableWallet, setDisableWallet] = useState(false);
  const [isStake3, setisStake3] = useState(false);
  const [isStake2, setisStake2] = useState(false);
  const [isStake, setisStake] = useState(false);

  const [notif, setnotif] = useState<string | null>(null);
  const [Apy, setApy] = useState(60);


  const [yourLastDeposit, setYourLastDeposit] = useState("");
  const [yourLastDeposit2, setYourLastDeposit2] = useState("");
  const [yourLastDeposit3, setYourLastDeposit3] = useState("");

  const [activeButton, setActiveButton] = useState<number>(1);

  const onStaked = (buttonNumber: number) => {
    setActiveButton(buttonNumber);
    if (buttonNumber == 3) {
      setApy(140);

    } else if (buttonNumber == 2) {
      setApy(90);
    } else {
      setApy(60);
    }
  };

  const GasCard = async () => {
    const data = await getData();

    setnotif(`${Number(`${data?.low.suggestedMaxFeePerGas}`).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`)

    const info = await getInfo();
    setholders(`${Number(`${info?.data.holders}`).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`)

    setmcap(`${Number(`${info?.data.fdv}`).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`);

    setTokenPrice(formatUnits(parseUnits((`${info?.data.fdv}`), 0), 8))

    const get = await getPrice()
    setchnge(`${Number(`${get?.data.variation24h}`).toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    })}`)
    

  }

  const getBalance = async (address: any) => {

    try {
      const { formatted } = await fetchBalance({
        address,
        chainId,
        token: tokenAddress,
      });
      setBalance(formatted);
    } catch (error) {
      console.log(error);
    }

  };

  const getYourStakingInfo = async (address: any) => {
    try {
      const sc = {
        address: SC1,
        abi: abis as never,
      };

      const sc2 = {
        address: SC2,
        abi: abis as never,
      };

      const sc3 = {
        address: SC3,
        abi: abis as never,
      };



      const data = await multicall({
        chainId,
        contracts: [
          {
            ...sc,
            functionName: "userInfo" as never,
            args: [address],
          },
          {
            ...sc,
            functionName: "claimableReward" as never,
            args: [address],
          },
          {
            ...sc2,
            functionName: "userInfo" as never,
            args: [address],
          },
          {
            ...sc2,
            functionName: "claimableReward" as never,
            args: [address],
          },
          {
            ...sc3,
            functionName: "userInfo" as never,
            args: [address],
          },
          {
            ...sc3,
            functionName: "claimableReward" as never,
            args: [address],
          },
          {
            ...sc,
            functionName: "vestingTime" as never,
          },
          {
            ...sc2,
            functionName: "vestingTime" as never,
          },
          {
            ...sc3,
            functionName: "vestingTime" as never,
          },
        ],
      });
      setisStake3((data[4].result as bigint[])[2] as bigint === (data[4].result as bigint[])[0] as bigint);
      setisStake2((data[2].result as bigint[])[2] as bigint === (data[2].result as bigint[])[0] as bigint);
      setisStake((data[0].result as bigint[])[2] as bigint === (data[0].result as bigint[])[0] as bigint);


      setYourLastDeposit(((data[0].result as bigint[])[2] as bigint + (data[6].result as bigint)).toString());
      setYourLastDeposit2(((data[2].result as bigint[])[2] as bigint + (data[7].result as bigint)).toString());
      setYourLastDeposit3(((data[4].result as bigint[])[2] as bigint + (data[8].result as bigint)).toString());


      setYourStaked(formatGwei((data[0].result as bigint[])[0] as bigint));
      setYourReward(formatGwei(data[1].result as bigint));
      setYourStaked2(formatGwei((data[2].result as bigint[])[0] as bigint));
      setYourReward2(formatGwei(data[3].result as bigint));
      setYourStaked3(formatGwei((data[4].result as bigint[])[0] as bigint));
      setYourReward3(formatGwei(data[5].result as bigint));
      setmyStaked(formatGwei((data[0].result as bigint[])[0] as bigint + (data[2].result as bigint[])[0] as bigint + (data[4].result as bigint[])[0] as bigint));

      setmyReward(formatGwei((data[1].result as bigint) + (data[3].result as bigint) + (data[5].result as bigint)));
    } catch (error) {
      console.log(error);
    }
  };

  const getStakingData = async () => {
    //info1
    try {
      const token = {
        address: tokenAddress,
        abi: erc20ABI as never,
      };

      const sc = {
        address: SC1,
        abi: abis as never,
      };

      const data = await multicall({
        chainId,
        contracts: [
          {
            ...token,
            functionName: "balanceOf" as never,
            args: [SC1],
          },
          {
            ...sc,
            functionName: "totalStaked" as never,
          },
          {
            ...sc,
            functionName: "userCount" as never,
          },
        ],
      });

      const sc2 = {
        address: SC2,
        abi: abis as never,
      };

      const data2 = await multicall({
        chainId,
        contracts: [
          {
            ...token,
            functionName: "balanceOf" as never,
            args: [SC2],
          },
          {
            ...sc2,
            functionName: "totalStaked" as never,
          },
          {
            ...sc2,
            functionName: "userCount" as never,
          },
        ],
      });

      //info3
      const sc3 = {
        address: SC3,
        abi: abis as never,
      };

      const data3 = await multicall({
        chainId,
        contracts: [
          {
            ...token,
            functionName: "balanceOf" as never,
            args: [SC3],
          },
          {
            ...sc3,
            functionName: "totalStaked" as never,
          },
          {
            ...sc3,
            functionName: "userCount" as never,
          },
        ],
      });

      setTVL((formatGwei((data[1].result as bigint) + (data2[1].result as bigint) + (data3[1].result as bigint))));


      await Moralis.start({
        apiKey: "5xuMrXGivEKKhyKXubyiqZUi1danxnmb84rllv3andRSMSDkAzN03vhXV2dejq01"
      });

      const response = await Moralis.EvmApi.token.getTokenPrice({
        "chain": "0x1",
        "include": "percent_change",
        "address": "0xb53b9e28b98c47e87acfd5a85eeb44a0940ecb12"
      });



    } catch (error) {
      console.log(error);
    }
  };
  //info
  const changeInput = (e: any) => {
    const input = e.target.value;
    const lastKey = input[input.length - 1];

    if (!isNaN(input)) {
      setInputAmount(input);
    } else if (lastKey === ",") {
      if (!input.includes(".")) {
        if (input.length === 1) {
          const newInput = "0" + ".";
          setInputAmount(newInput);
        } else {
          const newInput = input.slice(0, -1) + ".";
          setInputAmount(newInput);
        }
      }
    } else if (lastKey === "." && input.length === 1) {
      setInputAmount("0" + lastKey);
    }
  };

  const changeInput2 = (e: any) => {
    const input = e.target.value;
    const lastKey = input[input.length - 1];

    if (!isNaN(input)) {
      setInputAmount2(input);
    } else if (lastKey === ",") {
      if (!input.includes(".")) {
        if (input.length === 1) {
          const newInput = "0" + ".";
          setInputAmount2(newInput);
        } else {
          const newInput = input.slice(0, -1) + ".";
          setInputAmount2(newInput);
        }
      }
    } else if (lastKey === "." && input.length === 1) {
      setInputAmount2("0" + lastKey);
    }
  };

  const checkAllowance = async (ca: any, _tokenAddress: any, _inputAmount: any) => {
    try {
      const allowance = await readContract({
        address: _tokenAddress,
        abi: erc20ABI as never,
        functionName: "allowance" as never,
        args: [address, ca],
      });


      if (formatGwei(allowance as bigint) < _inputAmount) {
        approve(ca, _tokenAddress, _inputAmount);
      } else {  
        stake(ca, _inputAmount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const approve = async (ca: any, _tokenAddress: any, _inputAmount: any) => {
    try {
      const sendTx = async () => {
        const { hash } = await writeContract({
          address: _tokenAddress,
          abi: erc20ABI as never,
          functionName: "approve" as never,
          args: [ca, parseGwei(`${balance}`)],
        });

        await waitForTransaction({ chainId, hash });
        stake(ca, _inputAmount);
      
      };

      toast.promise(sendTx(), {
        loading: "Approving...",
        success: <b>Approve Successful !</b>,
        error: <b>Approve Failed !</b>,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const stake = async (ca: any, _inputAmount: any) => {
    try {

      console.log(ca)
      if (Number(_inputAmount) <= Number(balance)) {
        const sendTx = async () => {
          const { hash } = await writeContract({
            address: ca,
            abi: abis as never,
            functionName: "stake" as never,
            args: [parseGwei(_inputAmount), address],
          });

          await waitForTransaction({ chainId, hash });
          reload();
        };
      if (ca === SC3) {
        toast.promise(sendTx(), {
          loading: "Staking...",
          success: <b>Stake Successful !</b>,
          error: <b>Stake Failed minimum 500,000 MMAI !</b>,
        });
      } else if (ca === SC2) {
        toast.promise(sendTx(), {
          loading: "Staking...",
          success: <b>Stake Successful !</b>,
          error: <b>Stake Failed  minimum 200,000 MMAI !</b>,
        });
      } else {
        toast.promise(sendTx(), {
          loading: "Staking...",
          success: <b>Stake Successful !</b>,
          error: <b>Stake Failed  minimum 100,000 MMAI !</b>,
        });
      }
        
      } else {
        toast.error("Insufficient balance !");
      }
    } catch (error) {
      console.log(error);
    }
  };



  const unstake = async (ca: any, _tokenAddress: any, _yourStaked: any, _last: any, _isStake: any) => {
    try {
      const sendTx = async () => {
        const { hash } = await writeContract({
          address: ca,
          abi: abis as never,
          functionName: "unstake" as never,
          args: [parseGwei(_yourStaked), address],
        });

        await waitForTransaction({ chainId, hash });
        reload();
      };
      if (_isStake === false) {
        toast.promise(sendTx(), {
          loading: "Unstaking...",
          success: <b>Unstake Successful !</b>,
          error: `Unstake Failed before ${new Date(
            Number(_last) * 1000
          ).toLocaleDateString()} !`,
        });
      } else {
        toast.promise(sendTx(), {
          loading: "Unstaking...",
          success: <b>Unstake Successful !</b>,
          error: <b>You have't staked !</b>,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const harvest = async (ca: any) => {
    try {
      const sendTx = async () => {
        const { hash } = await writeContract({
          address: ca,
          abi: abis as never,
          functionName: "harvest" as never,
          args: [address],
        });

        await waitForTransaction({ chainId, hash });
        reload();
      };

      toast.promise(sendTx(), {
        loading: "Harvesting reward...",
        success: <b>Reward Harvested !</b>,
        error: <b>Error when harvesting !</b>,
      });
    } catch (error) {
      console.log(error);
    }
  };


  const emergency = async (ca: any) => {
    try {
      const sendTx = async () => {
        const { hash } = await writeContract({
          address: ca,
          abi: abis as never,
          functionName: "emergencyWithdraw" as never,
          args: [address],
        });

        await waitForTransaction({ chainId, hash });
        reload();
      };

      toast.promise(sendTx(), {
        loading: "Emergency Withdraw...",
        success: <b>Emergency Withdraw Successful !</b>,
        error: <b>Error when Emergency Withdraw !</b>,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const reload = () => {
    GasCard()
    getStakingData();
    getBalance(address);
    getYourStakingInfo(address);
  };

  const Spinner = () => {
    return (
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );
  };

  useEffect(() => {
    if (address) {
      getBalance(address);
      getYourStakingInfo(address);
    }
  }, [address]);

  useEffect(() => {
    GasCard()
    getStakingData();
  }, []);

  return (
    <>
      <Head>
        <title>Multimodal AI</title>
        <meta name="description" content="
        Multimodal AI Access the new AI Paradigm, higher performance levels than traditional single-modal AI methods in solving real-world problems."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={`-pb-5 sm:py-1 md:py-2 sm:px-5 ${styles.topnav}`}>
        <div className={styles.navlogo}>
          <Image
            src="/header.png"
            alt="AI"
            width="200"
            height="200"
            priority={true}
            className="w-[25vw] sm:w-[30vw] md:w-[15vw] lg:w-[16vw]"
          />
        </div>
        <div className={`!w-full  ${styles.navlinks}`}>
          {!disableWallet && (
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks

                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === "authenticated");

                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button className="px-2 py-[0.4rem] md:py-2 flex items-center mr-10 md:mr-20 hover:transition duration-[0.8s] hover:duration-[0.3s] ring-white ring-1 hover:ring-[#aa72ce] hover:shadow-md hover:shadow-[#aa72ce] "

                            onClick={openConnectModal}
                            type="button"
                            style={{
                              alignItems: "center",
                              fontWeight: "600",
                              borderRadius: "13px",
                              marginLeft: "13px",

                            }}
                          >
                            <Image
                              src="/wallet.png"
                              alt="AI"
                              width="30"
                              height="30"
                              className="invert pr-1 pb-1 w-5 md:w-7 lg:w-8"
                            />
                            <h1 className="text-[10px] md:text-sm">CONNECT</h1>

                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button onClick={openChainModal} type="button">
                            {" "}
                            Wrong network
                          </button>
                        );
                      }

                      return (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 12,

                          }}
                        >

                          <button className="px-2 py-2 sm:flex hidden justify-center items-center hover:transition duration-[0.8s] hover:duration-[0.3s] ring-white ring-1 hover:ring-[#aa72ce] hover:shadow-md hover:shadow-[#aa72ce]"

                            onClick={openChainModal}
                            style={{

                              alignItems: "center",
                              borderRadius: "13px",
                              color: "#ffff",

                            }}
                            type="button"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 20,
                                  height: 20,
                                  borderRadius: 999,
                                  overflow: "hidden",
                                  marginRight: "3px",
                                }}
                              >
                                {chain.iconUrl && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    alt={chain.name ?? "Chain icon"}
                                    src={chain.iconUrl}
                                    style={{ width: 35, height: 20 }}
                                  />
                                )}
                              </div>
                            )} <span className="text-sm">
                              {chain.name}</span>

                          </button>

                          <button className="flex mr-2 px-2 py-2  items-center hover:transition duration-[0.8s] hover:duration-[0.3s] ring-white ring-1 hover:ring-[#aa72ce] hover:shadow-md hover:shadow-[#aa72ce]"

                            onClick={openAccountModal}
                            type="button"
                            style={{
                              alignItems: "center",
                              fontWeight: "600",
                              borderRadius: "13px",
                              marginLeft: "13px",
                            }}
                          >
                            <Image
                              src="/wallet.png"
                              alt="AI"
                              width="30"
                              height="30"
                              className="invert md:pr-1 w-5 md:w-6"
                            />
                            <div className="hidden sm:block">
                              {account.displayName}
                            </div>

                          </button>
                          <a href="https://etherscan.io/gastracker"


                            className="px-2 py-2 flex items-center ring-1 ring-[#aa72ce] shadow-md shadow-[#aa72ce]"
                            type="button"

                            style={{
                              alignItems: "center",
                              fontWeight: "600",
                              borderRadius: "13px"
                            }}
                          >
                            <Image
                              src="/gas.svg"
                              alt="AI"
                              width="20"
                              height="20"
                              className="invert w-4  "
                            />
                            <h1 className="text-[10px] md:text-[14px] pl-1 ">
                              {notif}
                            </h1>
                          </a>



                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          )}
        </div>
      </div>
      <main className={styles.main}>
        <div className={`md:w-[85vw] -mt-14 lg:w-[92vw] w-[85vw] ${styles.center}`}>
          <div className=" grid-cols-2 md:flex lg:flex xl:flex gap-4 md:gap-8 w-full mb-10 ">

            <div className="hidden xl:flex lg:flex px-1 py-4 gap-4 md:gap-6 lg:w-2/3 mb-10 ">
              <div className="md:ring-1 bg-[#101625] shadow-lg shadow-[#aa72ce] ring-[#aa72ce] rounded-3xl gap-4 md:gap-5 w-full mb-10 ">
                <div className="py-3 text-center lg:text-md xl:text-xl font-semibold text-[white]">
                  <div className="justify-center flex">
                    <Image
                      src="/logo.png"
                      alt="AI"
                      width="200"
                      height="200"
                      className="w-28 my-8 ring-2 ring-[#4a2d5c] rounded-full shadow-xl shadow-[#aa72ce]"
                    />
                  </div>
                  <h1 className="mb-3 ">Total Value Locked</h1>
                  <div style={{
                    fillOpacity: "1",
                    height: "2px",
                    backgroundImage: "linear-gradient(289deg, rgba(171, 84, 244, 0), rgba(171, 84, 244, 0.5) 25%, rgb(255, 255, 255) 50%, rgba(171, 84, 244, 0.5) 75%, rgba(171, 84, 244, 0))",
                    borderWidth: "0px 0px 1px",
                    borderStyle: "initial",
                    borderColor: "initial",
                    borderImage: "initial",
                    marginLeft: "10px",
                    width: " 90%",
                  }}>

                  </div>

                </div>
                <div className="px-5 py-8 lg:text-sm xl:text-md flex justify-between">
                  <h1>$MMAI :</h1>
                  <p>
                    {tvl ? (
                      `${Number(tvl).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}`
                    ) : (
                      `00.0`
                    )}</p>
                </div>
              </div>
              <div className="md:ring-1 bg-[#101625] shadow-lg shadow-[#aa72ce] ring-[#aa72ce] rounded-3xl gap-4 md:gap-5 w-full mb-10  ">
                <div className="py-3 text-center lg:text-md xl:text-xl font-semibold text-[white]">
                  <div className="justify-center flex">
                    <Image
                      src="/logo.png"
                      alt="AI"
                      width="200"
                      height="200"
                      className="w-28 my-8 ring-2 ring-[#4a2d5c] rounded-full shadow-xl shadow-[#aa72ce]"
                    />
                  </div>
                  <h1 className="mb-3">My Staked</h1>
                  <div style={{
                    fillOpacity: "1",
                    height: "2px",
                    backgroundImage: "linear-gradient(289deg, rgba(171, 84, 244, 0), rgba(171, 84, 244, 0.5) 25%, rgb(255, 255, 255) 50%, rgba(171, 84, 244, 0.5) 75%, rgba(171, 84, 244, 0))",
                    borderWidth: "0px 0px 1px",
                    borderStyle: "initial",
                    borderColor: "initial",
                    borderImage: "initial",
                    marginLeft: "10px",
                    width: " 90%",
                  }}>

                  </div>

                </div>
                <div className="px-5 py-8 lg:text-sm xl:text-md flex justify-between">
                  <h1>$MMAI :</h1>
                  <p>
                    {myStaked ? (
                      `${Number(myStaked).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}`
                    ) : (
                      `00.0`
                    )}
                  </p>
                </div>
              </div>
              <div className=" md:ring-1 bg-[#101625] shadow-lg shadow-[#aa72ce] ring-[#aa72ce] rounded-3xl gap-4 md:gap-5 w-full mb-10 ">
                <div className="py-3 text-center lg:text-md xl:text-xl font-semibold text-[white]">
                  <div className="justify-center flex">
                    <Image
                      src="/logo.png"
                      alt="AI"
                      width="200"
                      height="200"
                      className="w-28 my-8 ring-2 ring-[#4a2d5c] rounded-full shadow-xl shadow-[#aa72ce]"
                    />
                  </div>
                  <h1 className="mb-3">My Reward</h1>
                  <div style={{
                    fillOpacity: "1",
                    height: "2px",
                    backgroundImage: "linear-gradient(289deg, rgba(171, 84, 244, 0), rgba(171, 84, 244, 0.5) 25%, rgb(255, 255, 255) 50%, rgba(171, 84, 244, 0.5) 75%, rgba(171, 84, 244, 0))",
                    borderWidth: "0px 0px 1px",
                    borderStyle: "initial",
                    borderColor: "initial",
                    borderImage: "initial",
                    marginLeft: "10px",
                    width: " 90%",
                  }}>

                  </div>

                </div>
                <div className="px-5 py-8 lg:text-sm xl:text-md flex justify-between">
                  <h1>$MMAI :</h1>
                  <p>
                    {myReward ? (
                      `${Number(myReward).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}`
                    ) : (
                      `00.0`
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="jutify-end xl:block md:hidden lg:block py-4 md:gap-6 lg:w-2/6 w-full mt-28 sm:-mt-10 md:mt-0 mb-20 md:mb-10">
              <div className="md:ring-1 bg-[#101625] shadow-lg shadow-[#aa72ce] ring-[#aa72ce] rounded-3xl gap-4 md:gap-5 w-full mb-6 py-4 px-4">
                <div className="flex" >
                  <Image
                    src="/favicon.png"
                    alt="AI"
                    width="60"
                    height="40"
                    className="w-12 h-12 md:w-14 md:h-14"
                  />
                  <div className="justify-between flex w-full">
                    <div className="block">
                      <h1 className="px-2 font-[700] text-[#8079a4] justify-between flex">

                        MMAI Price
                      </h1>
                      <h1 className="px-2 text-white font-bold text-sm  md:text-2xl">$
                        <span className="px-1">
                          {tokenPrice ? (
                            `${tokenPrice}`
                          ) : (`00.00`)}
                        </span>
                      </h1>
                    </div>
                  </div>
                  <span className="py-1 md:pt-8 px-4 text-white text-[12px]">{chnge}%</span>
                </div>

              </div>
              <div className="md:ring-1 bg-[#101625] shadow-lg shadow-[#aa72ce] ring-[#aa72ce] rounded-3xl gap-4 md:gap-5 w-full mb-6  py-4 px-4 ">
                <div className="ml-1 flex" >
                  <Image
                    src="/white.png"
                    alt="AI"
                    width="60"
                    height="40"
                    className="w-10 h-10 md:w-12 md:h-12"
                  />
                  <div className="block">
                    <h1 className="px-2 font-[700] text-[#8079a4]">
                      Market Cap
                    </h1>
                    <h1 className="px-2 text-white font-bold text-sm  md:text-2xl">$
                      <span className="px-1">
                        {mcap ? (
                          `${mcap}`
                        ) : (`00.00`)}
                      </span>
                    </h1>
                  </div>
                </div>
              </div>
              <div className="md:ring-1 bg-[#101625] shadow-lg shadow-[#aa72ce] ring-[#aa72ce] rounded-3xl gap-4 md:gap-5 w-full mb-6  py-4 px-4">
                <div className="ml-1 flex" >
                  <Image
                    src="/wnb.png"
                    alt="AI"
                    width="60"
                    height="40"
                    className="w-10 h-10 md:w-12 md:h-12"
                  />
                  <div className="block">
                    <h1 className="px-2 font-[700] text-[#8079a4]">
                      Estimasi Holders
                    </h1>
                    <h1 className="px-2 text-white font-bold text-sm  md:text-2xl">
                      {holders ? (
                        `${holders}`
                      ) : (`00.00`)}
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:hidden jutify-end py-4 md:gap-6 gap-6 md:flex w-full -mt-3 mb-10">
              <div className=" w-full mb-10 py-4 ">
                <div className="md:ring-1 bg-[#101625] shadow-lg shadow-[#aa72ce] ring-[#aa72ce] rounded-3xl gap-4 md:gap-5 w-full mb-10 py-4 px-4">
                  <div className="ml-1 flex" >
                    <Image
                      src="/favicon.png"
                      alt="AI"
                      width="60"
                      height="69"
                      className="w-12 h-12"
                    />
                     <div className="justify-between flex w-full">
                    <div className="block">
                      <h1 className="px-1 text-[14px] font-[700] text-[#8079a4] justify-between flex">
                        MMAI Price  <span className="py-1 px-1 text-white text-[10px]">{chnge}%</span>
                      </h1>
                      <h1 className="px-2 text-white font-bold text-sm md:text-lg">$
                        <span className="px-1">
                          {tokenPrice ? (
                            `${tokenPrice}`
                          ) : (`00.00`)}
                        </span>
                      </h1>
                    </div>
                  </div>
                 
                  </div>
                </div>
                <div className="md:ring-1 bg-[#101625] shadow-lg shadow-[#aa72ce] ring-[#aa72ce] rounded-3xl gap-4 md:gap-5 w-full py-4 px-4">
                  <div className="py-3 text-center text-xl font-semibold text-[white]">
                    <div className="justify-center flex">
                      <Image
                        src="/logo.png"
                        alt="AI"
                        width="200"
                        height="200"
                        className="w-24 my-4 ring-2 ring-[#4a2d5c] rounded-full shadow-xl shadow-[#aa72ce]"
                      />
                    </div>
                    <h1 className="mb-3 text-sm">Total Value Locked</h1>
                    <div style={{
                      fillOpacity: "1",
                      height: "2px",
                      backgroundImage: "linear-gradient(289deg, rgba(171, 84, 244, 0), rgba(171, 84, 244, 0.5) 25%, rgb(255, 255, 255) 50%, rgba(171, 84, 244, 0.5) 75%, rgba(171, 84, 244, 0))",
                      borderWidth: "0px 0px 1px",
                      borderStyle: "initial",
                      borderColor: "initial",
                      borderImage: "initial",
                      marginLeft: "10px",
                      width: " 90%",
                    }}>

                    </div>
                    <div className="px-3 py-3 text-sm flex justify-between">
                      <h1>$MMAI :</h1>
                      <p>
                        {tvl ? (
                          `${Number(tvl).toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}`
                        ) : (
                          `00.0`
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" w-full mb-10 py-4 ">
                <div className="md:ring-1 bg-[#101625] shadow-lg shadow-[#aa72ce] ring-[#aa72ce] rounded-3xl gap-4 md:gap-5 w-full mb-10 py-4 px-4">
                  <div className="ml-1 flex" >
                    <Image
                      src="/white.png"
                      alt="AI"
                      width="60"
                      height="69"
                      className="w-10 h-10"
                    />
                    <h1 className="ml-2 font-[800] text-[14px] text-[#8079a4]">
                      Market Cap <br />

                      <span className="text-white font-bold text-lg ">
                        <span className="pr-1">$</span>

                        {mcap ? (
                          `${mcap}`
                        ) : (`00.00`)}
                      </span>
                    </h1>
                  </div>
                </div>
                <div className="md:ring-1 bg-[#101625] shadow-lg shadow-[#aa72ce] ring-[#aa72ce] rounded-3xl gap-3 md:gap-2 w-full py-4 px-4">
                  <div className="py-3 text-center text-xl font-semibold text-[white]">
                    <div className="justify-center flex">
                      <Image
                        src="/logo.png"
                        alt="AI"
                        width="200"
                        height="200"
                        className="w-24 my-4 ring-2 ring-[#4a2d5c] rounded-full shadow-xl shadow-[#aa72ce]"
                      />
                    </div>
                    <h1 className="mb-3 text-sm">My Staked</h1>
                    <div style={{
                      fillOpacity: "1",
                      height: "2px",
                      backgroundImage: "linear-gradient(289deg, rgba(171, 84, 244, 0), rgba(171, 84, 244, 0.5) 25%, rgb(255, 255, 255) 50%, rgba(171, 84, 244, 0.5) 75%, rgba(171, 84, 244, 0))",
                      borderWidth: "0px 0px 1px",
                      borderStyle: "initial",
                      borderColor: "initial",
                      borderImage: "initial",
                      marginLeft: "10px",
                      width: " 90%",
                    }}>

                    </div>
                    <div className="px-3 py-3 text-sm flex justify-between">
                      <h1>$MMAI :</h1>
                      <p>
                        {myStaked ? (
                          `${Number(myStaked).toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}`
                        ) : (
                          `00.0`
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" w-full py-4 ">
                <div className="md:ring-1 bg-[#101625] shadow-lg shadow-[#aa72ce] ring-[#aa72ce] rounded-3xl gap-4 md:gap-5 w-full mb-10 py-4 px-4">
                  <div className="ml-1 flex" >
                    <Image
                      src="/wnb.png"
                      alt="AI"
                      width="60"
                      height="69"
                      className="w-10 h-10"
                    />
                    <h1 className="ml-2 font-[800] text-[14px] text-[#8079a4] ">
                      Estimasi Holders <br />
                      <span className="text-white font-bold text-lg ">
                        {holders ? (
                          `${holders}`
                        ) : (`00.00`)}
                      </span>
                    </h1>
                  </div>
                </div>
                <div className="md:ring-1 bg-[#101625] shadow-lg shadow-[#aa72ce] ring-[#aa72ce] rounded-3xl gap-4 md:gap-5 w-full py-4 px-4">
                  <div className="py-3 text-center text-xl font-semibold text-[white]">
                    <div className="justify-center flex">
                      <Image
                        src="/logo.png"
                        alt="AI"
                        width="200"
                        height="200"
                        className="w-24 my-4 ring-2 ring-[#4a2d5c] rounded-full shadow-xl shadow-[#aa72ce]"
                      />
                    </div>
                    <h1 className="mb-3 text-sm">My Reward</h1>
                    <div style={{
                      fillOpacity: "1",
                      height: "2px",
                      backgroundImage: "linear-gradient(289deg, rgba(171, 84, 244, 0), rgba(171, 84, 244, 0.5) 25%, rgb(255, 255, 255) 50%, rgba(171, 84, 244, 0.5) 75%, rgba(171, 84, 244, 0))",
                      borderWidth: "0px 0px 1px",
                      borderStyle: "initial",
                      borderColor: "initial",
                      borderImage: "initial",
                      marginLeft: "10px",
                      width: " 90%",
                    }}>

                    </div>
                    <div className="px-3 py-3 text-sm flex justify-between">
                      <h1>$MMAI :</h1>
                      <p>
                        {myReward ? (
                          `${Number(myReward).toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}`
                        ) : (
                          `00.0`
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full md:block -mt-28 lg:flex lg:justify-between rounded-3xl p-0.5 gap-5">
            <div className="relative w-full bg-[#101625]  lg:w-[59.5vw] p-0.5 shadow-lg shadow-[#aa72ce] ring-1 ring-[#aa72ce] gap-4 mb-10 rounded-3xl py-3.5 px-4 lg:py-5 lg:px-8">
              <div className="flex flex-col gap-6 py-2">
                <div className="px-2 justify-between flex">
                  <div>
                    <h1 className="font-light text-3xl text-[#ffff]">
                      MMAI STAKING
                    </h1>
                    <h1 className="font-medium  text-2xl text-[#ffff]">
                      00.0 $MMAI
                    </h1></div>
                    <div className="block px-4">
                  <h1 className="hp:text-sm sm:text-sm px-3 w-full text-start text-[10px] text-[#ffff]">APY Rate</h1>
                  <h1 className="text-3xl px-2 text-[#aa72ce] block">{Apy}% </h1>
                </div></div>

                <div className="flex gap-4 md:gap-6 font-extralight text-sm">
                  <Button label="7 Days" isActive={activeButton === 1} onClick={() => onStaked(1)} />
                  <Button label="14 Days" isActive={activeButton === 2} onClick={() => onStaked(2)} />
                  <Button label="24 Days" isActive={activeButton === 3} onClick={() => onStaked(3)} />
                </div>

                <div className="flex-1 flex justify-between items-center px-3 pt-4 border-b border-[#70509b]"></div>

                {activeButton === 1 ? (
                  <>
                    <div className="flex-1 flex justify-between items-center px-1">
                      <h1 className=" text-md font-medium">
                        Balance: <span>
                          {address ? (
                            `${Number(balance).toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })} $MMAI`
                          ) : (
                           `0 $MMAI `
                          )}</span>
                      </h1>
                    </div>
                    <div className="block sm:flex hp:flex justify-between md:flex-row gap-3 md:gap-8 w-full items-center">
                      <input
                        className="flex-1 w-full hp:w-auto h-12 ring-1 ring-[#ffff] hover:transition duration-[0.8s] hover:duration-[0.3s] rounded-2xl  hover:shadow-lg hover:shadow-[#aa72ce] hover:ring-[#aa72ce] bg-transparent p-4 placeholder:text-[#737373]"
                        type="text"
                        name="amount"
                        value={inputAmount}
                        onChange={(e) => changeInput(event)}
                        placeholder="minimum stake 100000"
                        id="amount"
                      />
                      <button
                        className="w-36 ring-1 my-2 ring-[#aa72ce] shadow-lg shadow-[#aa72ce] py-3 rounded-2xl font-medium"
                        onClick={() => checkAllowance(SC1, tokenAddress, inputAmount)}
                      >
                        Stake
                      </button>
                    </div>
                    <div className="flex-1 flex justify-between items-center px-1">
                      <h1 className=" text-md font-medium">
                        Staked: <span>
                          {yourStaked ? (
                            `${Number(yourStaked).toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })} $MMAI`
                          ) : (
                            <Spinner />
                          )}</span>
                      </h1>

                    </div>
                    <div className="block sm:flex hp:flex  justify-between md:flex-row gap-3 w-full md:gap-8   items-center">
                      <input
                        className="flex-1 w-full hp:w-auto h-12 ring-1 ring-[#ffff] hover:transition duration-[0.8s] hover:duration-[0.3s] rounded-2xl  hover:shadow-lg hover:shadow-[#aa72ce] hover:ring-[#aa72ce] bg-transparent p-4 placeholder:text-[#737373]"
                        type="text"
                        name="amount"
                        value={inputAmount2}
                        onChange={(e) => changeInput2(event)}
                        placeholder="Enter amount to unstake"
                        id="amount"
                      />
                      <button
                        className="w-36 my-2 ring-1 ring-[#aa72ce] shadow-lg shadow-[#aa72ce] py-3 rounded-2xl font-medium"
                        onClick={() => unstake(SC1, tokenAddress, inputAmount2, yourLastDeposit, isStake)}
                      >
                        Withdraw
                      </button>
                    </div>

                    {isConnected ? (
                      <>
                        <div className=" flex justify-between gap-2 2xl:gap-6 md:py-2">
                          <h1 className="text-[#808080] text-[10px] md:text-sm hp:text-sm ring-1 ring-transparent hover:transition duration-[0.8s] hover:duration-[0.3s] text-center  hover:shadow-lg hover:shadow-[#aa72ce] hover:ring-[#aa72ce] py-1 rounded-2xl font-medium">
                            <span className="text-[#ffff] font-bold">
                              {isStake ? (
                                null
                              ) : (
                                `Unlock at ${new Date(
                                  Number(yourLastDeposit) * 1000
                                ).toLocaleDateString()}`
                              )}
                            </span>
                          </h1>
                          <div className="flex md:gap-8 gap-3 justify-end w-full">
                            <button
                              className="px-2 py-2 sm:py-3 sm:px-4  md:w-36 ring-1  ring-[#aa72ce] hover:transition duration-[0.8s] hover:duration-[0.3s]  hover:shadow-lg hover:shadow-[#aa72ce] hover:ring-[#aa72ce] rounded-2xl font-medium"
                              onClick={() => emergency(SC1)}
                            >
                              Emergency
                            </button>
                            <button
                              className="px-2 py-2 sm:py-3 sm:px-4 md:w-36 ring-1 ring-[#aa72ce] hover:transition duration-[0.8s] hover:duration-[0.3s]   hover:shadow-lg hover:shadow-[#aa72ce] hover:ring-[#aa72ce] rounded-2xl font-medium"
                              onClick={() => harvest(SC1)}
                            >
                              Harvest
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-24 flex flex-col items-center justify-center">
                        <p className="text-center text-[#808080]">
                          Please connect your wallet first
                        </p>
                      </div>
                    )}

                  </>
                ) : (
                  null
                )}

                {activeButton === 2 ? (
                  <>
                    <div className="flex-1 flex justify-between items-center px-1">
                      <h1 className=" text-md font-medium">
                        Balance: <span>
                          {address ? (
                            `${Number(balance).toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })} $MMAI`
                          ) : (
                            `0 $MMAI`
                          )}</span>
                      </h1>
                    </div>
                    <div className="block sm:flex hp:flex justify-between md:flex-row gap-3 md:gap-8 w-full items-center">
                      <input
                        className="flex-1 w-full hp:w-auto h-12 ring-1 ring-[#ffff] hover:transition duration-[0.8s] hover:duration-[0.3s] rounded-2xl  hover:shadow-lg hover:shadow-[#aa72ce] hover:ring-[#aa72ce] bg-transparent p-4 placeholder:text-[#737373]"
                        type="text"
                        name="amount"
                        value={inputAmount}
                        onChange={(e) => changeInput(event)}
                        placeholder="minimum stake 250000"
                        id="amount"
                      />
                      <button
                        className="w-36 ring-1 my-2 ring-[#aa72ce] shadow-lg shadow-[#aa72ce] py-3 rounded-2xl font-medium"
                        onClick={() => checkAllowance(SC2, tokenAddress, inputAmount)}
                      >
                        Stake
                      </button>
                    </div>
                    <div className="flex-1 flex justify-between items-center px-1">
                      <h1 className=" text-md font-medium">
                        Staked: <span>
                          {yourStaked2 ? (
                            `${Number(yourStaked2).toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })} $MMAI`
                          ) : (
                            <Spinner />
                          )}</span>
                      </h1>

                    </div>
                    <div className="block sm:flex hp:flex  justify-between md:flex-row gap-3 w-full md:gap-8   items-center">
                      <input
                        className="flex-1 w-full hp:w-auto h-12 ring-1 ring-[#ffff] hover:transition duration-[0.8s] hover:duration-[0.3s] rounded-2xl  hover:shadow-lg hover:shadow-[#aa72ce] hover:ring-[#aa72ce] bg-transparent p-4 placeholder:text-[#737373]"
                        type="text"
                        name="amount"
                        value={inputAmount2}
                        onChange={(e) => changeInput2(event)}
                        placeholder="Enter amount to unstake"
                        id="amount"
                      />
                      <button
                        className="w-36 my-2 ring-1 ring-[#aa72ce] shadow-lg shadow-[#aa72ce] py-3 rounded-2xl font-medium"
                        onClick={() => unstake(SC2, tokenAddress, inputAmount2, yourLastDeposit2, isStake2)}
                      >
                        Withdraw
                      </button>
                    </div>

                    {isConnected ? (
                      <>
                        <div className=" flex justify-between gap-4 2xl:gap-6 md:py-2">
                          <h1 className="text-[#808080] text-sm ring-1 ring-transparent hover:transition duration-[0.8s] hover:duration-[0.3s] text-center  hover:shadow-lg hover:shadow-[#aa72ce] hover:ring-[#aa72ce] py-1 rounded-2xl font-medium">
                            <span className="text-[#ffff] font-bold">
                              {isStake2 ? (
                                null
                              ) : (
                                ` Unlock at : ${new Date(
                                  Number(yourLastDeposit2) * 1000
                                ).toLocaleDateString()}`
                              )}
                            </span>
                          </h1>
                          <div className="flex md:gap-8 gap-3 justify-end w-full">
                            <button
                              className="py-3 px-4 md:w-36 ring-1  ring-[#aa72ce] hover:transition duration-[0.8s] hover:duration-[0.3s]  hover:shadow-lg hover:shadow-[#aa72ce] hover:ring-[#aa72ce] rounded-2xl font-medium"
                              onClick={() => emergency(SC2)}
                            >
                              Emergency
                            </button>
                            <button
                              className="py-3 px-4 md:w-36 ring-1 ring-[#aa72ce] hover:transition duration-[0.8s] hover:duration-[0.3s]   hover:shadow-lg hover:shadow-[#aa72ce] hover:ring-[#aa72ce] rounded-2xl font-medium"
                              onClick={() => harvest(SC2)}
                            >
                              Harvest
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-24 flex flex-col items-center justify-center">
                        <p className="text-center text-[#808080]">
                          Please connect your wallet first
                        </p>
                      </div>
                    )}

                  </>
                ) : (
                  null
                )}

                {activeButton === 3 ? (
                  <>
                    <div className="flex-1 flex justify-between items-center px-1">
                      <h1 className=" text-md font-medium">
                        Balance: <span>
                          {address ? (
                            `${Number(balance).toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })} $MMAI`
                          ) : (
                            `0 $MMAI`
                          )}</span>
                      </h1>
                    </div>
                    <div className="block sm:flex hp:flex justify-between md:flex-row gap-3 md:gap-8 w-full items-center">
                      <input
                        className="flex-1 w-full hp:w-auto h-12 ring-1 ring-[#ffff] hover:transition duration-[0.8s] hover:duration-[0.3s] rounded-2xl  hover:shadow-lg hover:shadow-[#aa72ce] hover:ring-[#aa72ce] bg-transparent p-4 placeholder:text-[#737373]"
                        type="text"
                        name="amount"
                        value={inputAmount}
                        onChange={(e) => changeInput(event)}
                        placeholder="minimum stake 500000"
                        id="amount"
                      />
                      <button
                        className="w-36 ring-1 my-2 ring-[#aa72ce] shadow-lg shadow-[#aa72ce] py-3 rounded-2xl font-medium"
                        onClick={() => checkAllowance(SC3, tokenAddress, inputAmount)}
                      >
                        Stake
                      </button>
                    </div>
                    <div className="flex-1 flex justify-between items-center px-1">
                      <h1 className=" text-md font-medium">
                        Staked: <span>
                          {yourStaked3 ? (
                            `${Number(yourStaked3).toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })} $MMAI`
                          ) : (
                            <Spinner />
                          )}</span>
                      </h1>

                    </div>
                    <div className="block sm:flex hp:flex  justify-between md:flex-row gap-3 w-full md:gap-8   items-center">
                      <input
                        className="flex-1 w-full hp:w-auto h-12 ring-1 ring-[#ffff] hover:transition duration-[0.8s] hover:duration-[0.3s] rounded-2xl  hover:shadow-lg hover:shadow-[#aa72ce] hover:ring-[#aa72ce] bg-transparent p-4 placeholder:text-[#737373]"
                        type="text"
                        name="amount"
                        value={inputAmount2}
                        onChange={(e) => changeInput2(event)}
                        placeholder="Enter amount to unstake"
                        id="amount"
                      />
                      <button
                        className="w-36 my-2 ring-1 ring-[#aa72ce] shadow-lg shadow-[#aa72ce] py-3 rounded-2xl font-medium"
                        onClick={() => unstake(SC3, tokenAddress, inputAmount2, yourLastDeposit, isStake3)}
                      >
                        Withdraw
                      </button>
                    </div>

                    {isConnected ? (
                      <>
                        <div className=" flex justify-between gap-4 2xl:gap-6 md:py-2">
                          <h1 className="text-[#808080] text-sm ring-1 ring-transparent hover:transition duration-[0.8s] hover:duration-[0.3s] text-center  hover:shadow-lg hover:shadow-[#aa72ce] hover:ring-[#aa72ce] py-1 rounded-2xl font-medium">
                            <span className="text-[#ffff] font-bold">
                              {isStake3 ? (
                                null
                              ) : (
                                ` Unlock at : ${new Date(
                                  Number(yourLastDeposit3) * 1000
                                ).toLocaleDateString()}`
                              )}
                            </span>
                          </h1>
                          <div className="flex md:gap-8 gap-3 justify-end w-full">
                            <button
                              className="py-3 px-4 md:w-36 ring-1  ring-[#aa72ce] hover:transition duration-[0.8s] hover:duration-[0.3s]  hover:shadow-lg hover:shadow-[#aa72ce] hover:ring-[#aa72ce] rounded-2xl font-medium"
                              onClick={() => emergency(SC3)}
                            >
                              Emergency
                            </button>
                            <button
                              className="py-3 px-4 md:w-36 ring-1 ring-[#aa72ce] hover:transition duration-[0.8s] hover:duration-[0.3s]   hover:shadow-lg hover:shadow-[#aa72ce] hover:ring-[#aa72ce] rounded-2xl font-medium"
                              onClick={() => harvest(SC3)}
                            >
                              Harvest
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-24 flex flex-col items-center justify-center">
                        <p className="text-center text-[#808080]">
                          Please connect your wallet first
                        </p>
                      </div>
                    )}

                  </>
                ) : (
                  null
                )}

              </div>
            </div>
            <iframe
              src="https://app.uniswap.org/#/swap?outputCurrency=0xadf7De5E41Cd7a5905E7D75E08dB6E3e9f7e6cDa"
              height="100%"
              width="100%"
              className="relative flex justify-center w-full h-[120vw] bg-[#101625] sm:h-[75vw] md:h-[55vw]  lg:h-[40vw] lg:w-[30vw] shadow-lg shadow-[#aa72ce] ring-1 ring-[#aa72ce] gap-4 rounded-2xl "
            />

          </div>
          <Image
            src={"/header.png"}
            alt="token"
            width={340}
            height={340}
            className="w-[30vw] py-2 sm:w-36"
          />
          <div className={styles.footer}>

            <p className="font-mono">
              Copyright {` `}
              <a
                href=""
                className="font-mono"
                target="_blank"
              >
                MultiModal Ai
              </a>
              .
            </p>
          </div>
        </div>
      </main >

    </>
  );
}
