import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class IndustrialMicrobes extends Card implements IProjectCard {
  public migrated = true;
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.INDUSTRIAL_MICROBES,
      tags: [Tag.MICROBE, Tag.BUILDING],
      cost: 12,
      productionBox: {energy: 1, steel: 1},

      metadata: {
        cardNumber: '158',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1).steel(1));
        }),
        description: 'Increase your Energy production and your steel production 1 step each.',
      },
    });
  }
  public play() {
    return undefined;
  }
}

