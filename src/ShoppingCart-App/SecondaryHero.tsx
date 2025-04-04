import {
  secondaryHero,
  secondaryHero__heading,
} from './SecondaryHero.module.scss'

const SecondaryHero = ({ pageName }: { pageName: string }) => {
  return (
    <section className={secondaryHero}>
      <h2 className={secondaryHero__heading}>{pageName}</h2>
    </section>
  )
}

export default SecondaryHero
