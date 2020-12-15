import React from 'react';
import { Control } from '@/utils/form';

export function ThemeSelector({ value, onChange }: Control<Theme>) {
  const handleChange = onChange || (() => void 0);

  const createOption = (theme: Theme) => (
    <div className={`theme ${theme} ${value === theme ? 'active' : ''}`.trim()}>
      <div onClick={() => handleChange(theme)} />
    </div>
  );

  return (
    <div className="theme-selector">
      {createOption('light')}
      {createOption('dark')}
      <style jsx>{`
        .theme-selector {
          @include flex(center);
        }

        .theme {
          text-align: center;
          font-size: 12px;
          line-height: 1.5em;

          > div {
            @include dimen(70px, 45px);
            @include relative();

            border-radius: 5px;
            border: 2px solid transparent;
            cursor: pointer;
            overflow: hidden;

            &:after {
              $size: 7px;
              @include absolute(6px, null, 6px);
              @include sq-dimen($size);

              content: '';
              background: #ff5f57;
              border-radius: 50%;
              box-shadow: $size * 1.5 0 0 #ffbd2e, $size * 3 0 0 #28ca41;
            }

            &:before {
              @include absolute(0, null, 0);
              @include sq-dimen(100%);
              border-radius: 3px;
              content: '';
            }
          }

          &.light {
            &:after {
              content: 'Light';
            }

            > div {
              &:before {
                background-color: #eee;
              }
            }
          }

          &.dark {
            margin-left: 20px;

            &:after {
              content: 'Dark';
            }

            > div {
              &:before {
                background-color: #232323;
              }
            }
          }

          &.active {
            > div {
              border-color: var(--accent-color);
            }
          }
        }
      `}</style>
    </div>
  );
}
