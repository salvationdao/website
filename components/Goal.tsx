import { Button, Text, Progress, Card } from "@mantine/core"
import { ethers, utils } from "ethers"
import { useWeb3 } from "../state/web3"

interface Props {
    currentTotalExpected: number
    currentPercentage: number
    currentRound?: ethers.BigNumberish
}

function GoalCard({ currentTotalExpected, currentPercentage }: Props) {
    const { currentChainId, deployments, changeChain, account, connect, currentRound, currentRoundSupply } = useWeb3()
    let displayProgress = 0
    let numerator
    if (currentRoundSupply) {
        numerator = +currentRoundSupply.toString()
        displayProgress = (numerator / 300000) * 100
    }
    const wrongNetwork = currentChainId !== deployments.chainID && account

    return (
        <Card
            withBorder
            radius="md"
            p="xl"
            mt={0}
            mb={20}
            sx={(theme) => ({
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
            })}
        >
            <Text size="xs" transform="uppercase" weight={700} color="dimmed">
                <>Monthly goal {currentRound ? `(Current Round: ${currentRound})` : "$300,000"}</>
            </Text>
            {account && !wrongNetwork && (
                <Text size="lg" weight={500}>
                    ${numerator?.toLocaleString()} / $300,000
                </Text>
            )}
            {account && !wrongNetwork && <Progress value={displayProgress} mt="md" size={50} color={"orange"} radius="lg" animate />}
            {wrongNetwork && (
                <Button
                    mt={"2rem"}
                    variant="gradient"
                    size={"xl"}
                    gradient={{ from: "orange", to: "red" }}
                    fullWidth
                    onClick={() => {
                        changeChain(deployments.chainID)
                    }}
                >
                    Switch Network
                </Button>
            )}

            {!account && (
                <Button
                    mt={"2rem"}
                    variant="gradient"
                    size={"xl"}
                    gradient={{ from: "orange", to: "red" }}
                    fullWidth
                    onClick={() => {
                        connect()
                    }}
                >
                    Connect Wallet
                </Button>
            )}
            <a target="_blank" rel="noreferrer" href={`${deployments.blockExplorerURL}address/${deployments.recovery}`}>
                <Text mt={"0.25rem"} color={"orange"} align="right" size={"sm"}>
                    view on etherscan
                </Text>
            </a>
        </Card>
    )
}

export default GoalCard
