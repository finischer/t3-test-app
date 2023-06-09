import { Avatar, Box, Group, Navbar as MantineNavbar, Menu, NavLink, Text, UnstyledButton, rem, useMantineTheme } from "@mantine/core";
import { IconChevronLeft, IconChevronRight, IconDoor, IconHome, IconLogout, IconTools } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useNotification from "~/hooks/useNotification";

const User = () => {
    const { showSuccessNotification } = useNotification()
    const { data: session } = useSession();
    const theme = useMantineTheme();
    const router = useRouter()

    const handleLogout = async () => {
        const data = await signOut({ redirect: false, callbackUrl: "/" })
        void router.push(data.url)
        showSuccessNotification({
            title: "Logout erfgolreich",
            message: "Ich hoffe, wir sehen uns bald wieder 👋"
        })
    }

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Box
                    // onClick={() => void handleLogout()}
                    sx={{
                        paddingTop: theme.spacing.sm,
                        borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                            }`,
                    }}
                >
                    <UnstyledButton
                        sx={{
                            display: 'block',
                            width: '100%',
                            padding: theme.spacing.xs,
                            borderRadius: theme.radius.sm,
                            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                            '&:hover': {
                                backgroundColor:
                                    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                            },
                        }}
                    >
                        <Group>
                            <Avatar
                                src={session?.user.image}
                                radius="xl"
                            />
                            <Box sx={{ flex: 1 }}>
                                <Text size="sm" weight={500}>
                                    {session?.user.name}
                                </Text>
                                <Text color="dimmed" size="xs">
                                    {session?.user.email}
                                </Text>
                            </Box>

                            {theme.dir === 'ltr' ? (
                                <IconChevronRight size={rem(18)} />
                            ) : (
                                <IconChevronLeft size={rem(18)} />
                            )}
                        </Group>
                    </UnstyledButton>
                </Box>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item icon={<IconLogout size={14} />} onClick={() => void handleLogout()}>Ausloggen</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}

const Navbar = ({ opened }: { opened: boolean }) => {
    const router = useRouter()

    const isActive = (href: string) => {
        if (href === "/") return router.pathname.length === 1

        return router.pathname.startsWith(href)
    }

    const goTo = (href: string) => {
        void router.push(href, undefined, { shallow: true })
    }

    return (
        <MantineNavbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
            <MantineNavbar.Section grow style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
                <NavLink
                    onClick={() => goTo("/")}
                    active={isActive("/")}
                    label="Home"
                    description=""
                    rightSection=""
                    icon={<IconHome size="1.3rem" />}
                />
                <NavLink
                    onClick={() => goTo("/rooms")}
                    active={isActive("/rooms")}
                    label="Raum beitreten"
                    description=""
                    rightSection=""
                    icon={<IconDoor size="1.3rem" />}
                />
                <NavLink
                    onClick={() => goTo("/gameshows/create")}
                    active={isActive("/gameshows")}
                    label="Spielshow erstellen"
                    description="Erstelle deine eigene Spielshow"
                    rightSection=""
                    icon={<IconTools size="1.3rem" />}
                />
            </MantineNavbar.Section>

            <MantineNavbar.Section>
                <User />
            </MantineNavbar.Section>
        </MantineNavbar>
    )
}

export default Navbar