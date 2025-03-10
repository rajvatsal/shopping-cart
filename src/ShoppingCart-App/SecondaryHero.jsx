import {
  secondaryHero,
  secondaryHero__heading,
} from './SecondaryHero.module.scss'
import { string } from 'prop-types'

const SecondaryHero = ({ pageName }) => {
  return (
    <section className={secondaryHero}>
      <h2 className={secondaryHero__heading}>{pageName}</h2>
    </section>
  )
}

SecondaryHero.propTypes = {
  pageName: string.isRequired,
}

export default SecondaryHero
