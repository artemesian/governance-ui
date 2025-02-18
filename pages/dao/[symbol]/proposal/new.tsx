import Link from 'next/link'
import { useRouter } from 'next/router'
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import * as yup from 'yup'
import {
  ArrowLeftIcon,
  PlusCircleIcon,
  XCircleIcon,
} from '@heroicons/react/outline'
import {
  getInstructionDataFromBase64,
  Governance,
  ProgramAccount,
} from '@solana/spl-governance'
import { PublicKey } from '@solana/web3.js'
import Button, { LinkButton, SecondaryButton } from '@components/Button'
import Input from '@components/inputs/Input'
import Textarea from '@components/inputs/Textarea'
import TokenBalanceCardWrapper from '@components/TokenBalance/TokenBalanceCardWrapper'
import useGovernanceAssets from '@hooks/useGovernanceAssets'
import useQueryContext from '@hooks/useQueryContext'
import useRealm from '@hooks/useRealm'
import { getTimestampFromDays } from '@tools/sdk/units'
import { formValidation, isFormValid } from '@utils/formValidation'
import {
  ComponentInstructionData,
  Instructions,
  InstructionsContext,
  UiInstruction,
} from '@utils/uiTypes/proposalCreationTypes'
import useWalletStore from 'stores/useWalletStore'
import { notify } from 'utils/notifications'
import Clawback from 'VoteStakeRegistry/components/instructions/Clawback'
import Grant from 'VoteStakeRegistry/components/instructions/Grant'
import InstructionContentContainer from './components/InstructionContentContainer'
import ProgramUpgrade from './components/instructions/bpfUpgradeableLoader/ProgramUpgrade'
import CreateAssociatedTokenAccount from './components/instructions/CreateAssociatedTokenAccount'
import CustomBase64 from './components/instructions/CustomBase64'
import Empty from './components/instructions/Empty'
import MakeChangeMaxAccounts from './components/instructions/Mango/MakeChangeMaxAccounts'
import MakeChangeReferralFeeParams from './components/instructions/Mango/MakeChangeReferralFeeParams'
import Mint from './components/instructions/Mint'
import CreateObligationAccount from './components/instructions/Solend/CreateObligationAccount'
import DepositReserveLiquidityAndObligationCollateral from './components/instructions/Solend/DepositReserveLiquidityAndObligationCollateral'
import InitObligationAccount from './components/instructions/Solend/InitObligationAccount'
import RefreshObligation from './components/instructions/Solend/RefreshObligation'
import RefreshReserve from './components/instructions/Solend/RefreshReserve'
import WithdrawObligationCollateralAndRedeemReserveLiquidity from './components/instructions/Solend/WithdrawObligationCollateralAndRedeemReserveLiquidity'
import SplTokenTransfer from './components/instructions/SplTokenTransfer'
import VoteBySwitch from './components/VoteBySwitch'
import FriktionDeposit from './components/instructions/Friktion/FriktionDeposit'
import CreateNftPluginRegistrar from './components/instructions/NftVotingPlugin/CreateRegistrar'
import CreateNftPluginMaxVoterWeightRecord from './components/instructions/NftVotingPlugin/CreateMaxVoterWeightRecord'
import ConfigureNftPluginCollection from './components/instructions/NftVotingPlugin/ConfigureCollection'
import SwitchboardAdmitOracle from './components/instructions/Switchboard/AdmitOracle'
import SwitchboardRevokeOracle from './components/instructions/Switchboard/RevokeOracle'
import FriktionWithdraw from './components/instructions/Friktion/FriktionWithdraw'
import FriktionClaimPendingDeposit from './components/instructions/Friktion/FriktionClaimPendingDeposit'
import FriktionClaimPendingWithdraw from './components/instructions/Friktion/FriktionClaimPendingWithdraw'
import MakeChangePerpMarket from './components/instructions/Mango/MakeChangePerpMarket'
import MakeAddOracle from './components/instructions/Mango/MakeAddOracle'
import MakeAddSpotMarket from './components/instructions/Mango/MakeAddSpotMarket'
import CreateStream from './components/instructions/Streamflow/CreateStream'
import CancelStream from './components/instructions/Streamflow/CancelStream'
import StakeValidator from './components/instructions/Validators/StakeValidator'
import DeactivateValidatorStake from './components/instructions/Validators/DeactivateStake'
import WithdrawValidatorStake from './components/instructions/Validators/WithdrawStake'
import MakeChangeSpotMarket from './components/instructions/Mango/MakeChangeSpotMarket'
import MakeCreatePerpMarket from './components/instructions/Mango/MakeCreatePerpMarket'
import useCreateProposal from '@hooks/useCreateProposal'
import CastleDeposit from './components/instructions/Castle/CastleDeposit'
import MakeInitMarketParams from './components/instructions/Foresight/MakeInitMarketParams'
import MakeInitMarketListParams from './components/instructions/Foresight/MakeInitMarketListParams'
import MakeInitCategoryParams from './components/instructions/Foresight/MakeInitCategoryParams'
import MakeResolveMarketParams from './components/instructions/Foresight/MakeResolveMarketParams'
import MakeAddMarketListToCategoryParams from './components/instructions/Foresight/MakeAddMarketListToCategoryParams'
import RealmConfig from './components/instructions/RealmConfig'
import MakeSetMarketMetadataParams from './components/instructions/Foresight/MakeSetMarketMetadataParams'
import CloseTokenAccount from './components/instructions/CloseTokenAccount'
import { InstructionDataWithHoldUpTime } from 'actions/createProposal'
import CastleWithdraw from './components/instructions/Castle/CastleWithdraw'
import MeanCreateAccount from './components/instructions/Mean/MeanCreateAccount'
import MeanFundAccount from './components/instructions/Mean/MeanFundAccount'
import MeanWithdrawFromAccount from './components/instructions/Mean/MeanWithdrawFromAccount'
import MeanCreateStream from './components/instructions/Mean/MeanCreateStream'
import MeanTransferStream from './components/instructions/Mean/MeanTransferStream'
import ChangeDonation from './components/instructions/Change/ChangeDonation'
import VotingMintConfig from './components/instructions/Vsr/VotingMintConfig'
import CreateVsrRegistrar from './components/instructions/Vsr/CreateRegistrar'
import GoblinGoldDeposit from './components/instructions/GoblinGold/GoblinGoldDeposit'
import GoblinGoldWithdraw from './components/instructions/GoblinGold/GoblinGoldWithdraw'
import MakeSetMarketMode from './components/instructions/Mango/MakeSetMarketMode'
import CreateGatewayPluginRegistrar from './components/instructions/GatewayPlugin/CreateRegistrar'
import ConfigureGatewayPlugin from './components/instructions/GatewayPlugin/ConfigureGateway'
import MakeChangeQuoteParams from './components/instructions/Mango/MakeChangeQuoteParams'
import CreateTokenMetadata from './components/instructions/CreateTokenMetadata'
import UpdateTokenMetadata from './components/instructions/UpdateTokenMetadata'
import TypeaheadSelect from '@components/TypeaheadSelect'
import { StyledLabel } from '@components/inputs/styles'
import classNames from 'classnames'
import MakeRemoveSpotMarket from './components/instructions/Mango/MakeRemoveSpotMarket'
import MakeRemovePerpMarket from './components/instructions/Mango/MakeRemovePerpMarket'
import MakeSwapSpotMarket from './components/instructions/Mango/MakeSwapSpotMarket'
import MakeRemoveOracle from './components/instructions/Mango/MakeRemoveOracle'
import SagaPreOrder from './components/instructions/Solana/SagaPhone/SagaPreOrder'
import MakeDepositToMangoAccount from './components/instructions/Mango/MakeDepositToMangoAccount'
import MakeDepositToMangoAccountCsv from './components/instructions/Mango/MakeDepositToMangoAccountCsv'
import TokenRegister from './components/instructions/Mango/MangoV4/TokenRegister'
import EditToken from './components/instructions/Mango/MangoV4/EditToken'
import PerpEdit from './components/instructions/Mango/MangoV4/PerpEdit'
import Serum3RegisterMarket from './components/instructions/Mango/MangoV4/Serum3RegisterMarket'
import PerpCreate from './components/instructions/Mango/MangoV4/PerpCreate'
import TokenRegisterTrustless from './components/instructions/Mango/MangoV4/TokenRegisterTrustless'
import TransferDomainName from './components/instructions/TransferDomainName'
import DepositForm from './components/instructions/Everlend/DepositForm'
import WithdrawForm from './components/instructions/Everlend/WithdrawForm'
import InitUser from './components/instructions/Serum/InitUser'
import MakeChangeReferralFeeParams2 from './components/instructions/Mango/MakeChangeReferralFeeParams2'
import GrantForm from './components/instructions/Serum/GrantForm'
import JoinDAO from './components/instructions/JoinDAO'
import UpdateConfigAuthority from './components/instructions/Serum/UpdateConfigAuthority'
import UpdateConfigParams from './components/instructions/Serum/UpdateConfigParams'
import ClaimMangoTokens from './components/instructions/Mango/ClaimTokens'

const TITLE_LENGTH_LIMIT = 130

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
})
const defaultGovernanceCtx: InstructionsContext = {
  instructionsData: [],
  handleSetInstructions: () => null,
  governance: null,
  setGovernance: () => null,
}
export const NewProposalContext = createContext<InstructionsContext>(
  defaultGovernanceCtx
)

// Takes the first encountered governance account
function extractGovernanceAccountFromInstructionsData(
  instructionsData: ComponentInstructionData[]
): ProgramAccount<Governance> | null {
  return (
    instructionsData.find((itx) => itx.governedAccount)?.governedAccount ?? null
  )
}

const New = () => {
  const router = useRouter()
  const { handleCreateProposal } = useCreateProposal()
  const { fmtUrlWithCluster } = useQueryContext()
  const { symbol, realm, realmDisplayName, canChooseWhoVote } = useRealm()
  const { getAvailableInstructions } = useGovernanceAssets()
  const availableInstructions = getAvailableInstructions()
  const { fetchRealmGovernance } = useWalletStore((s) => s.actions)
  const [voteByCouncil, setVoteByCouncil] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [
    governance,
    setGovernance,
  ] = useState<ProgramAccount<Governance> | null>(null)
  const [isLoadingSignedProposal, setIsLoadingSignedProposal] = useState(false)
  const [isLoadingDraft, setIsLoadingDraft] = useState(false)

  const isLoading = isLoadingSignedProposal || isLoadingDraft
  //   const customInstructionFilterForSelectedGovernance = (
  //     instructionType: Instructions
  //   ) => {
  //     if (!governance) {
  //       return true
  //     } else {
  //       const governanceType = governance.account.accountType
  //       const instructionsAvailiableAfterProgramGovernance = [Instructions.Base64]
  //       switch (governanceType) {
  //         case GovernanceAccountType.ProgramGovernanceV1:
  //         case GovernanceAccountType.ProgramGovernanceV2:
  //           return instructionsAvailiableAfterProgramGovernance.includes(
  //             instructionType
  //           )
  //         default:
  //           return true
  //       }
  //     }
  //   }

  const getAvailableInstructionsForIndex = (index) => {
    if (index === 0) {
      return availableInstructions
    } else {
      return availableInstructions
    }
  }
  const [instructionsData, setInstructions] = useState<
    ComponentInstructionData[]
  >([{ type: undefined }])
  const handleSetInstructions = (val: any, index) => {
    const newInstructions = [...instructionsData]
    newInstructions[index] = { ...instructionsData[index], ...val }
    setInstructions(newInstructions)
  }
  const handleSetForm = ({ propertyName, value }) => {
    setFormErrors({})
    setForm({ ...form, [propertyName]: value })
  }
  const setInstructionType = ({ value, idx }) => {
    const newInstruction = {
      type: value,
    }
    handleSetInstructions(newInstruction, idx)
  }
  const addInstruction = () => {
    setInstructions([...instructionsData, { type: undefined }])
  }
  const removeInstruction = (idx) => {
    setInstructions([...instructionsData.filter((x, index) => index !== idx)])
  }
  const handleGetInstructions = async () => {
    const instructions: UiInstruction[] = []
    for (const inst of instructionsData) {
      if (inst.getInstruction) {
        const instruction: UiInstruction = await inst?.getInstruction()
        instructions.push(instruction)
      }
    }
    return instructions
  }
  const handleTurnOffLoaders = () => {
    setIsLoadingSignedProposal(false)
    setIsLoadingDraft(false)
  }

  const handleCreate = async (isDraft) => {
    setFormErrors({})
    if (isDraft) {
      setIsLoadingDraft(true)
    } else {
      setIsLoadingSignedProposal(true)
    }

    const { isValid, validationErrors }: formValidation = await isFormValid(
      schema,
      form
    )

    let instructions: UiInstruction[] = []
    try {
      instructions = await handleGetInstructions()
    } catch (e) {
      handleTurnOffLoaders()
      notify({ type: 'error', message: `${e}` })
      throw e
    }

    let proposalAddress: PublicKey | null = null
    if (!realm) {
      handleTurnOffLoaders()
      throw 'No realm selected'
    }

    if (isValid && instructions.every((x: UiInstruction) => x.isValid)) {
      let selectedGovernance = governance
      if (!governance) {
        handleTurnOffLoaders()
        throw Error('No governance selected')
      }

      const additionalInstructions = [
        ...(instructions
          .flatMap((instruction) => {
            return instruction.additionalSerializedInstructions?.map((x) => {
              return {
                data: x ? getInstructionDataFromBase64(x) : null,
                holdUpTime: instruction.customHoldUpTime
                  ? getTimestampFromDays(instruction.customHoldUpTime)
                  : selectedGovernance?.account?.config
                      .minInstructionHoldUpTime,
                prerequisiteInstructions:
                  instruction.prerequisiteInstructions || [],
                chunkSplitByDefault: instruction.chunkSplitByDefault || false,
                signers: instruction.signers,
                shouldSplitIntoSeparateTxs:
                  instruction.shouldSplitIntoSeparateTxs,
                chunkBy: instruction.chunkBy || 2,
              }
            })
          })
          .filter((x) => x) as InstructionDataWithHoldUpTime[]),
      ]

      const instructionsData = [
        ...additionalInstructions,
        ...instructions.map((x) => {
          return {
            data: x.serializedInstruction
              ? getInstructionDataFromBase64(x.serializedInstruction)
              : null,
            holdUpTime: x.customHoldUpTime
              ? getTimestampFromDays(x.customHoldUpTime)
              : selectedGovernance?.account?.config.minInstructionHoldUpTime,
            prerequisiteInstructions: x.prerequisiteInstructions || [],
            chunkSplitByDefault: x.chunkSplitByDefault || false,
            signers: x.signers,
            prerequisiteInstructionsSigners:
              x.prerequisiteInstructionsSigners || [],
            shouldSplitIntoSeparateTxs: x.shouldSplitIntoSeparateTxs,
            chunkBy: x.chunkBy || 2,
          }
        }),
      ]

      try {
        // Fetch governance to get up to date proposalCount

        if (governance.pubkey != undefined) {
          selectedGovernance = (await fetchRealmGovernance(
            governance.pubkey
          )) as ProgramAccount<Governance>
        } else {
          selectedGovernance = (await fetchRealmGovernance(
            governance
          )) as ProgramAccount<Governance>
        }
        proposalAddress = await handleCreateProposal({
          title: form.title,
          description: form.description,
          governance: selectedGovernance,
          instructionsData,
          voteByCouncil,
          isDraft,
        })

        const url = fmtUrlWithCluster(
          `/dao/${symbol}/proposal/${proposalAddress}`
        )

        router.push(url)
      } catch (ex) {
        console.log(ex)
        notify({ type: 'error', message: `${ex}` })
      }
    } else {
      setFormErrors(validationErrors)
    }
    handleTurnOffLoaders()
  }

  useEffect(() => {
    if (instructionsData?.length) {
      setInstructions([instructionsData[0]])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- TODO please fix, it can cause difficult bugs. You might wanna check out https://bobbyhadz.com/blog/react-hooks-exhaustive-deps for info. -@asktree
  }, [instructionsData[0]?.governedAccount?.pubkey])

  useEffect(() => {
    const governedAccount = extractGovernanceAccountFromInstructionsData(
      instructionsData
    )

    setGovernance(governedAccount)
  }, [instructionsData])

  useEffect(() => {
    if (
      typeof router.query['i'] === 'string' &&
      availableInstructions.length &&
      instructionsData[0]?.type === undefined
    ) {
      const instructionType = parseInt(router.query['i'], 10) as Instructions
      const instruction = availableInstructions.find(
        (i) => i.id === instructionType
      )

      if (instruction) {
        setInstructionType({ value: instruction, idx: 0 })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- TODO please fix, it can cause difficult bugs. You might wanna check out https://bobbyhadz.com/blog/react-hooks-exhaustive-deps for info. -@asktree
  }, [router.query, availableInstructions, instructionsData])

  // Map instruction enum with components
  //
  // by default, components are created with index/governance attributes
  // if a component needs specials attributes, use componentBuilderFunction object
  const instructionMap: {
    [key in Instructions]:
      | ((props: {
          index: number
          governance: ProgramAccount<Governance> | null
        }) => JSX.Element | null)
      | {
          componentBuilderFunction: (props: {
            index: number
            governance: ProgramAccount<Governance> | null
          }) => JSX.Element | null
        }
      | null
  } = useMemo(
    () => ({
      [Instructions.Transfer]: SplTokenTransfer,
      [Instructions.ProgramUpgrade]: ProgramUpgrade,
      [Instructions.Mint]: Mint,
      [Instructions.Base64]: CustomBase64,
      [Instructions.None]: Empty,
      [Instructions.MangoAddOracle]: MakeAddOracle,
      [Instructions.MangoAddSpotMarket]: MakeAddSpotMarket,
      [Instructions.MangoChangeMaxAccounts]: MakeChangeMaxAccounts,
      [Instructions.MangoChangePerpMarket]: MakeChangePerpMarket,
      [Instructions.MangoChangeReferralFeeParams]: MakeChangeReferralFeeParams,
      [Instructions.MangoChangeReferralFeeParams2]: MakeChangeReferralFeeParams2,
      [Instructions.MangoChangeSpotMarket]: MakeChangeSpotMarket,
      [Instructions.MangoCreatePerpMarket]: MakeCreatePerpMarket,
      [Instructions.MangoSetMarketMode]: MakeSetMarketMode,
      [Instructions.MangoChangeQuoteParams]: MakeChangeQuoteParams,
      [Instructions.MangoRemoveSpotMarket]: MakeRemoveSpotMarket,
      [Instructions.MangoRemovePerpMarket]: MakeRemovePerpMarket,
      [Instructions.MangoSwapSpotMarket]: MakeSwapSpotMarket,
      [Instructions.MangoRemoveOracle]: MakeRemoveOracle,
      [Instructions.MangoV4TokenRegister]: TokenRegister,
      [Instructions.MangoV4TokenEdit]: EditToken,
      [Instructions.MangoV4PerpEdit]: PerpEdit,
      [Instructions.MangoV4Serum3RegisterMarket]: Serum3RegisterMarket,
      [Instructions.MangoV4PerpCreate]: PerpCreate,
      [Instructions.MangoV4TokenRegisterTrustless]: TokenRegisterTrustless,
      [Instructions.CreateStream]: CreateStream,
      [Instructions.CancelStream]: CancelStream,
      [Instructions.Grant]: Grant,
      [Instructions.Clawback]: Clawback,
      [Instructions.CreateAssociatedTokenAccount]: CreateAssociatedTokenAccount,
      [Instructions.DepositIntoVolt]: FriktionDeposit,
      [Instructions.WithdrawFromVolt]: FriktionWithdraw,
      [Instructions.ClaimPendingDeposit]: FriktionClaimPendingDeposit,
      [Instructions.ClaimPendingWithdraw]: FriktionClaimPendingWithdraw,
      [Instructions.DepositIntoCastle]: CastleDeposit,
      [Instructions.WithrawFromCastle]: CastleWithdraw,
      [Instructions.MeanCreateAccount]: MeanCreateAccount,
      [Instructions.MeanFundAccount]: MeanFundAccount,
      [Instructions.MeanWithdrawFromAccount]: MeanWithdrawFromAccount,
      [Instructions.MeanCreateStream]: MeanCreateStream,
      [Instructions.MeanTransferStream]: MeanTransferStream,
      [Instructions.DepositIntoGoblinGold]: GoblinGoldDeposit,
      [Instructions.WithdrawFromGoblinGold]: GoblinGoldWithdraw,
      [Instructions.CreateSolendObligationAccount]: CreateObligationAccount,
      [Instructions.InitSolendObligationAccount]: InitObligationAccount,
      [Instructions.DepositReserveLiquidityAndObligationCollateral]: DepositReserveLiquidityAndObligationCollateral,
      [Instructions.WithdrawObligationCollateralAndRedeemReserveLiquidity]: WithdrawObligationCollateralAndRedeemReserveLiquidity,
      [Instructions.SwitchboardAdmitOracle]: SwitchboardAdmitOracle,
      [Instructions.SwitchboardRevokeOracle]: SwitchboardRevokeOracle,
      [Instructions.RefreshSolendObligation]: RefreshObligation,
      [Instructions.RefreshSolendReserve]: RefreshReserve,
      [Instructions.ForesightInitMarket]: MakeInitMarketParams,
      [Instructions.ForesightInitMarketList]: MakeInitMarketListParams,
      [Instructions.ForesightInitCategory]: MakeInitCategoryParams,
      [Instructions.ForesightResolveMarket]: MakeResolveMarketParams,
      [Instructions.ForesightAddMarketListToCategory]: MakeAddMarketListToCategoryParams,
      [Instructions.ForesightSetMarketMetadata]: MakeSetMarketMetadataParams,
      [Instructions.RealmConfig]: RealmConfig,
      [Instructions.CreateNftPluginRegistrar]: CreateNftPluginRegistrar,
      [Instructions.CreateNftPluginMaxVoterWeight]: CreateNftPluginMaxVoterWeightRecord,
      [Instructions.ConfigureNftPluginCollection]: ConfigureNftPluginCollection,
      [Instructions.CloseTokenAccount]: CloseTokenAccount,
      [Instructions.VotingMintConfig]: VotingMintConfig,
      [Instructions.CreateVsrRegistrar]: CreateVsrRegistrar,
      [Instructions.CreateGatewayPluginRegistrar]: CreateGatewayPluginRegistrar,
      [Instructions.ConfigureGatewayPlugin]: ConfigureGatewayPlugin,
      [Instructions.ChangeMakeDonation]: ChangeDonation,
      [Instructions.CreateTokenMetadata]: CreateTokenMetadata,
      [Instructions.UpdateTokenMetadata]: UpdateTokenMetadata,
      [Instructions.SagaPreOrder]: SagaPreOrder,
      [Instructions.DepositToMangoAccount]: MakeDepositToMangoAccount,
      [Instructions.DepositToMangoAccountCsv]: MakeDepositToMangoAccountCsv,
      [Instructions.StakeValidator]: StakeValidator,
      [Instructions.DeactivateValidatorStake]: DeactivateValidatorStake,
      [Instructions.WithdrawValidatorStake]: WithdrawValidatorStake,
      [Instructions.DifferValidatorStake]: null,
      [Instructions.TransferDomainName]: TransferDomainName,
      [Instructions.EverlendDeposit]: DepositForm,
      [Instructions.EverlendWithdraw]: WithdrawForm,
      [Instructions.SerumInitUser]: InitUser,
      [Instructions.SerumGrantLockedSRM]: {
        componentBuilderFunction: ({ index, governance }) => (
          <GrantForm
            index={index}
            governance={governance}
            isLocked={true}
            isMsrm={false}
          />
        ),
      },
      [Instructions.SerumGrantLockedMSRM]: {
        componentBuilderFunction: ({ index, governance }) => (
          <GrantForm
            index={index}
            governance={governance}
            isLocked={true}
            isMsrm={true}
          />
        ),
      },
      [Instructions.SerumGrantVestSRM]: {
        componentBuilderFunction: ({ index, governance }) => (
          <GrantForm
            index={index}
            governance={governance}
            isLocked={false}
            isMsrm={false}
          />
        ),
      },
      [Instructions.SerumGrantVestMSRM]: {
        componentBuilderFunction: ({ index, governance }) => (
          <GrantForm
            index={index}
            governance={governance}
            isLocked={false}
            isMsrm={true}
          />
        ),
      },
      [Instructions.SerumUpdateGovConfigParams]: UpdateConfigParams,
      [Instructions.SerumUpdateGovConfigAuthority]: UpdateConfigAuthority,
      [Instructions.JoinDAO]: JoinDAO,
      [Instructions.ClaimMangoTokens]: ClaimMangoTokens,
    }),
    []
  )

  const getCurrentInstruction = useCallback(
    ({
      typeId,
      index,
    }: {
      typeId?: Instructions
      index: number
    }): JSX.Element => {
      if (typeof typeId === 'undefined' || typeId === null) return <></>

      const conf = instructionMap[typeId]
      if (!conf) return <></>

      if ('componentBuilderFunction' in conf) {
        return (
          conf.componentBuilderFunction({
            index,
            governance,
          }) ?? <></>
        )
      }

      const component = conf

      return (
        React.createElement(component, {
          index,
          governance,
        }) ?? <></>
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- TODO please fix, it can cause difficult bugs. You might wanna check out https://bobbyhadz.com/blog/react-hooks-exhaustive-deps for info. -@asktree
    []
  )

  const titleTooLong = form.title.length > TITLE_LENGTH_LIMIT

  return (
    <div className="grid grid-cols-12 gap-4">
      <div
        className={`bg-bkg-2 col-span-12 md:col-span-7 md:order-first lg:col-span-8 order-last p-4 md:p-6 rounded-lg space-y-3 ${
          isLoading ? 'pointer-events-none' : ''
        }`}
      >
        <>
          <Link href={fmtUrlWithCluster(`/dao/${symbol}/`)}>
            <a className="flex items-center text-fgd-3 text-sm transition-all hover:text-fgd-1">
              <ArrowLeftIcon className="h-4 w-4 mr-1 text-primary-light" />
              Back
            </a>
          </Link>
          <div className="border-b border-fgd-4 pb-4 pt-2">
            <div className="flex items-center justify-between">
              <h1>
                Add a proposal
                {realmDisplayName ? ` to ${realmDisplayName}` : ``}{' '}
              </h1>
            </div>
          </div>
          <div className="pt-2">
            <div className="pb-4 relative min-h-[100px]">
              <Input
                label="Title"
                placeholder="Title of your proposal"
                value={form.title}
                type="text"
                error={formErrors['title']}
                showErrorState={titleTooLong}
                onChange={(evt) =>
                  handleSetForm({
                    value: evt.target.value,
                    propertyName: 'title',
                  })
                }
              />
              <div className="max-w-lg w-full absolute bottom-4 left-0">
                <div
                  className={classNames(
                    'absolute',
                    'bottom-0',
                    'right-0',
                    'text-xs',
                    titleTooLong ? 'text-error-red' : 'text-white/50'
                  )}
                >
                  {form.title.length} / {TITLE_LENGTH_LIMIT}
                </div>
              </div>
            </div>
            <Textarea
              className="mb-3"
              label="Description"
              placeholder="Description of your proposal or use a github gist link (optional)"
              value={form.description}
              onChange={(evt) =>
                handleSetForm({
                  value: evt.target.value,
                  propertyName: 'description',
                })
              }
            ></Textarea>
            {canChooseWhoVote && (
              <VoteBySwitch
                checked={voteByCouncil}
                onChange={() => {
                  setVoteByCouncil(!voteByCouncil)
                }}
              ></VoteBySwitch>
            )}
            <NewProposalContext.Provider
              value={{
                instructionsData,
                handleSetInstructions,
                governance,
                setGovernance,
              }}
            >
              <h2>Transactions</h2>
              {instructionsData.map((instruction, idx) => {
                const availableInstructionsForIdx = getAvailableInstructionsForIndex(
                  idx
                )
                return (
                  <div
                    key={idx}
                    className="mb-3 border border-fgd-4 p-4 md:p-6 rounded-lg"
                  >
                    <StyledLabel>Transaction {idx + 1}</StyledLabel>
                    <TypeaheadSelect
                      className="max-w-lg"
                      options={availableInstructionsForIdx.map(
                        (availableInstruction) => ({
                          data: availableInstruction,
                          key: availableInstruction.id.toString(),
                          text: availableInstruction.name,
                        })
                      )}
                      placeholder="Add a transaction"
                      selected={
                        instruction.type
                          ? {
                              key: instruction.type.id.toString(),
                            }
                          : undefined
                      }
                      onSelect={(option) => {
                        setInstructionType({ value: option?.data, idx })
                      }}
                    />
                    <div className="flex items-end pt-4">
                      <InstructionContentContainer
                        idx={idx}
                        instructionsData={instructionsData}
                      >
                        {getCurrentInstruction({
                          typeId: instruction.type?.id,
                          index: idx,
                        })}
                      </InstructionContentContainer>
                      {idx !== 0 && (
                        <LinkButton
                          className="flex font-bold items-center ml-4 text-fgd-1 text-sm"
                          onClick={() => removeInstruction(idx)}
                        >
                          <XCircleIcon className="h-5 mr-1.5 text-red w-5" />
                          Remove
                        </LinkButton>
                      )}
                    </div>
                  </div>
                )
              })}
            </NewProposalContext.Provider>
            <div className="flex justify-end mt-4 mb-8 px-6">
              <LinkButton
                className="flex font-bold items-center text-fgd-1 text-sm"
                onClick={addInstruction}
              >
                <PlusCircleIcon className="h-5 mr-1.5 text-green w-5" />
                Add transaction
              </LinkButton>
            </div>
            <div className="border-t border-fgd-4 flex justify-end mt-6 pt-6 space-x-4">
              <SecondaryButton
                disabled={isLoading}
                isLoading={isLoadingDraft}
                onClick={() => handleCreate(true)}
              >
                Save draft
              </SecondaryButton>
              <Button
                isLoading={isLoadingSignedProposal}
                disabled={isLoading}
                onClick={() => handleCreate(false)}
              >
                Add proposal
              </Button>
            </div>
          </div>
        </>
      </div>
      <div className="col-span-12 md:col-span-5 lg:col-span-4 space-y-4">
        <TokenBalanceCardWrapper />
      </div>
    </div>
  )
}

export default New
