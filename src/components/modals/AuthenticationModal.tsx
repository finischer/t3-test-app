import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Notification,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useToggle, upperFirst } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { signIn } from 'next-auth/react';
import React from 'react';
import useNotification from '~/hooks/useNotification';
import { api } from '~/utils/api';


const AuthenticationModal = () => {
    const { showErrorNotification } = useNotification()
    const [type, toggle] = useToggle<"login" | "register">(['login', 'register']);
    const { mutate: register, isLoading: isRegistering } = api.users.create.useMutation({
        onSuccess: () => form.reset(),
        onError: (e) => {
            const errorMessage = JSON.parse(e.message);
            if (errorMessage && errorMessage[0]) {
                showErrorNotification({
                    title: "Ein Fehler ist aufgetreten",
                    message: errorMessage[0].message
                })
            } else {
                showErrorNotification({
                    title: "Ein Fehler ist aufgetreten",
                    message: "Probiere es später nochmal"
                })
            }
        }
    })

    const form = useForm({
        initialValues: {
            username: "",
            email: "",
            password: "",
            rememberMe: false
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    })

    const handleSubmit = form.onSubmit((formValues) => {
        if (type === "login") {
            signIn("credentials", {
                ...formValues,
                redirect: false
            })
        } else if (type === "register") {
            register(formValues)
        }
    })


    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                Willkommen zurück!
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5} onClick={() => toggle()}>
                {type === "login" ? "Noch keinen Account? " : "Du hast bereits einen Account? "}
                <Anchor size="sm" component="button">
                    {type === "login" ? "Registriere dich hier" : "Log dich ein"}
                </Anchor>
            </Text>



            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={handleSubmit}>
                    {type === "register" &&
                        <TextInput
                            label="Username"
                            placeholder="Quizmaster9000"
                            required {...form.getInputProps("username")}
                            disabled={isRegistering}
                        />

                    }
                    <TextInput
                        label="Email"
                        placeholder="you@mantine.dev"
                        required {...form.getInputProps("email")}
                        disabled={isRegistering}

                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        required
                        mt="md"
                        disabled={isRegistering}

                        {...form.getInputProps("password")} />
                    {type === "login" &&
                        <Group position="apart" mt="lg">
                            <Checkbox label="Remember me" disabled {...form.getInputProps("rememberMe", { type: "checkbox" })} />
                            <Anchor component="button" size="sm">
                                Forgot password?
                            </Anchor>
                        </Group>
                    }
                    <Button fullWidth mt="xl" type='submit' disabled={isRegistering}
                    >
                        {type === "login" ? "Einloggen" : "Registrieren"}
                    </Button>
                </form>
            </Paper>
        </Container>
    )
}

export default AuthenticationModal