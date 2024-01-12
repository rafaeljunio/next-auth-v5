import { CardWrapper } from "./card-wrapper"

export const LoginForm = () => {
  return (
    <CardWrapper
      headerLabel="Bem vindo de volta"
      backButtonLabel="Não tem um conta?"
      backButtonHref="/auth/register"
      showSocial
    >
      Login Form
    </CardWrapper>
  )
}
