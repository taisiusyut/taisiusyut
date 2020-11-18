import React from 'react';
import { Control } from '@/utils/form';

const accentColors: AccentColor[] = [
  'blue',
  'purple',
  'red',
  'amber',
  'green',
  'grey'
];

export function AccentColorSelector({ value, onChange }: Control<AccentColor>) {
  return (
    <div className="accent-color-selector">
      {accentColors.map((color, index) => (
        <div
          key={index}
          className={`${color} ${value === color ? 'active' : ''}`.trim()}
          onClick={() => onChange && onChange(color)}
        />
      ))}
      <style jsx>
        {`
          .accent-color-selector {
            @include flex(center);
            @include padding-x(5px);

            > div {
              @include sq-dimen(20px);
              @include relative();

              border-radius: 50%;
              cursor: pointer;
              overflow: hidden;

              &:nth-child(n + 2) {
                margin-left: 10px;
              }
            }

            @each $name, $color in $accent-colors {
              .#{'' + $name} {
                background-color: map-get($color, primary);

                &:after {
                  @include absolute();
                  @include sq-dimen(100%);
                  content: '';
                }

                &.active {
                  &:before {
                    @include absolute(0px, 0, 0px, 0);
                    @include sq-dimen(8px);

                    content: '';
                    border-radius: 50%;
                    background-color: #fff;
                    margin: auto;
                  }
                }
              }
            }
          }
        `}
      </style>
    </div>
  );
}
