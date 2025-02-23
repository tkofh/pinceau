import type { Schema } from 'untyped'
import type { CSSProperties } from './css'
import type { DesignToken, RawTokenType, ResponsiveToken } from './tokens'
import type { PinceauTheme } from './theme'

/**
 * A configuration layer as expressed by the user.
 */
export interface ConfigLayer {
  cwd?: string
  configFileName?: string
  tokens?: DefineConfigType<any>
}

/**
 * A config file import content.
 *
 * Includes both the content of the file as string and its evalued content as import.
 */
export interface ConfigFileImport {
  config: any
  content: string
  path: string
}

/**
 * A layer of configuration that has been resolved before being loaded.
 */
export interface ResolvedConfigLayer<T = PinceauTheme> {
  path: string | undefined
  content: string
  definitions: { [key: string]: any }
  config: T
}

/**
 * A configuration data once loaded by Pinceau.
 */
export interface LoadConfigResult<T = any> {
  config: T
  definitions: { [key: string]: any }
  sources: string[]
}

/**
 * Utils properties mappings.
 */
export interface PinceauUtilsProperties {
  [key: string]: CSSProperties | ((value: any) => CSSProperties)
}

/**
 * Media queries properties.
 */
export interface PinceauMediaProperties {
  $schema?: Schema
  [key: string]: DesignToken<RawTokenType> | RawTokenType | Schema
}

/**
 * Reserved keys in define config type.
 */
export interface ReservedConfigKeys {
  media?: PinceauMediaProperties
  utils?: PinceauUtilsProperties
}

/**
 * Extensible configuration type
 */
export type Theme<T> =
  {
    $schema?: Schema
  }
  |
  { [K in keyof T]?: T[K] extends DesignToken<ResponsiveToken> ? (Partial<T[K]['raw']> | DesignToken<Partial<T[K]['raw']>> | DesignToken) : Theme<T[K]> }
  |
  { [K in keyof T]?: T[K] extends DesignToken ? (T[K]['raw'] | T[K]) : Theme<T[K]> }
  |
  { [K in keyof T]?: T[K] extends DesignToken ? (T[K] | T[K]['raw'] | ResponsiveToken | DesignToken<ResponsiveToken> | DesignToken<T[K]['raw']>) : Theme<T[K]> }
  |
  { [K in keyof T]?: DesignToken | DesignToken<ResponsiveToken> | ResponsiveToken | RawTokenType | Theme<T[K]> }

/**
 * Reserved keys and extensible configuration type
 */
export type DefineConfigType<T extends PinceauTheme> = Theme<T> & ReservedConfigKeys
